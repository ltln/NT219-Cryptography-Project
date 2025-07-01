import { PrismaClient } from '../prisma/client'; // Đường dẫn phải đúng với prisma.output
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { CryptoUtil } from './crypto';
import type { User, Product } from '../prisma/client'; // Import types cho an toàn

const prisma = new PrismaClient();
const cryptoUtil = new CryptoUtil();

async function main() {
  //  Seed Users
  const users: User[] = [];
  for (let i = 0; i < 10; i++) {
    const username = `user${i + 1}`;
    const email = cryptoUtil.encrypt("louis@lt.id.vn");
    const password = await bcrypt.hash('test', 10);

    const user = await prisma.user.create({
      data: {
        username,
        fullname: cryptoUtil.encrypt(faker.person.fullName()),
        email,
        password,
      },
    });
    users.push(user);
  }

  // Seed Products
  const products: Product[] = [];
  for (let i = 0; i < 30; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.book.title(),
        description: faker.commerce.productDescription(),
        coverImage: faker.image.url({ width: 300, height: 400 }),
        coverType: faker.helpers.arrayElement(['HARD', 'SOFT']) as
          | 'HARD'
          | 'SOFT',
        dimensionsX: faker.number.int({ min: 10, max: 30 }),
        dimensionsY: faker.number.int({ min: 10, max: 30 }),
        dimensionsZ: faker.number.int({ min: 1, max: 10 }),
        weight: faker.number.int({ min: 0.5, max: 5 }),
        price: faker.number.int({ min: 10, max: 300 }) * 1000,
        discount: faker.number.int({ min: 0, max: 30 }) * 1000,
        images: Array.from({ length: 3 }, () => faker.image.url()),
        language: faker.helpers.arrayElement([
          'English',
          'Vietnamese',
          'French',
        ]),
        pageCount: faker.number.int({ min: 100, max: 500 }),
        publisher: faker.company.name(),
        author: faker.person.fullName(),
        publishYear: faker.number.int({ min: 1990, max: 2023 }),
        stock: faker.number.int({ min: 10, max: 100 }),
        category: faker.commerce.department(),
        sellerId: faker.helpers.arrayElement(users).userId,
      },
    });
    products.push(product);
  }

  //  Seed Orders + OrderDetails + Payment
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(users);
    const orderProducts = faker.helpers.arrayElements(products, 2);

    let total = 0;
    const orderDetailsData = orderProducts.map((product) => {
      const quantity = faker.number.int({ min: 1, max: 3 });
      const price = product.price;
      const subtotal = price * quantity;
      total += subtotal;

      return {
        productId: product.productId,
        quantity,
        price,
        subtotal,
      };
    });

    const paymentMethod = faker.helpers.arrayElement(['COD', 'CARD']);

    await prisma.order.create({
      data: {
        userId: user.userId,
        sellerId: faker.helpers.arrayElement(orderProducts.map((p) => p.sellerId)),
        fullName: cryptoUtil.encrypt(user.fullname),
        phone: cryptoUtil.encrypt(faker.phone.number()),
        email: cryptoUtil.encrypt(faker.internet.email()),
        address: cryptoUtil.encrypt(faker.location.streetAddress()),
        total,
        status: 'PROCESSING',
        orderDetails: {
          create: orderDetailsData,
        },
        payment: {
          create: {
            method: paymentMethod as 'CARD' | 'COD',
            amount: total,
          },
        },
      },
    });
  }
}

main()
  .then(() => console.log('✅ Seeding completed.'))
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
