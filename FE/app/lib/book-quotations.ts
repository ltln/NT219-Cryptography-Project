const quotations = [
    {
        quote: "Đọc sách mang đến cho chúng ta những người bạn không quen biết.",
        author: "Honoré de Balzac"
    },
    {
        quote: "Một cuốn sách là một món quà mà bạn có thể mở đi mở lại nhiều lần.",
        author: "Garrison Keillor",
    },
    {
        quote: "Hãy suy nghĩ trước khi nói. Hãy đọc trước khi nghĩ.",
        author: "Fran Lebowitz",
    },
    {
        quote: "Đọc sách là tấm vé giảm giá để đến mọi nơi.",
        author: "Mary Schmich",
    },
    {
        quote: "Sách và cửa là một. Bạn có thể mở chúng ra và đi vào một thế giới khác.",
        author: "Jeanette Winterson",
    },
    {
        quote: "Sách là tấm gương: bạn chỉ nhìn thấy trong sách những gì bạn đã có bên trong mình.",
        author: "Carlos Ruiz Zafón",
    },
    {
        quote: "Khi bạn đắm mình trong một cuốn sách, thời gian sẽ trôi rất nhanh.",
        author: "Chloe Thurlow",
    },
    {
        quote: "Nếu bạn không thích đọc, nghĩa là bạn chưa tìm được cuốn sách phù hợp.",
        author: "J.K. Rowling",
    },
    {
        quote: "Đừng bao giờ để đến ngày mai cuốn sách mà bạn có thể đọc hôm nay.",
        author: "Holbrook Jackson",
    },
    {
        quote: "Hãy đọc một ngàn cuốn sách, và lời nói của bạn sẽ tuôn chảy như một dòng sông.",
        author: "Lisa See",
    },
    {
        quote: "Đọc sách là một cách thông minh để không cần phải suy nghĩ.",
        author: "Walter Moers",
    },
    {
        quote: "Một cuốn sách hay là một sự kiện trong cuộc đời.",
        author: "Stendhal",
    },
    {
        quote: "Như thế nào là một thể xác không có tâm hồn? Đó là một căn phòng không có nổi một quyển sách.",
        author: "Cicero",
    },
    {
        quote: "Việc đọc tất cả những cuốn sách hay giống như trò chuyện với những bộ óc tuyệt vời nhất của các thế kỷ trước.",
        author: "Rene Descartes",
    },
    {
        quote: "Thư viện là nơi sinh sống của những linh hồn bước ra từ những trang giấy vào ban đêm.",
        author: "Isabel Allende",
    },
    {
        quote: "Không nên coi việc đọc sách cho trẻ em như một việc vặt hay nhiệm vụ. Nó nên được coi là một món quà.",
        author: "Kate DiCamillo",
    },
    {
        quote: "Có sách nên nếm thử, có sách nên ngấu nghiến,nhưng chỉ có một số nên nhai kỹ và tiêu hóa kỹ lưỡng",
        author: "Sir Francis Bacon",
    },
    {
        quote: "Bạn biết mình đã đọc một cuốn sách hay khi lật đến trang cuối cùng và cảm thấy như mất đi một người bạn",
        author: "Paul Sweeney",
    },
    {
        quote: "Những ngày mưa nên ở nhà với một tách trà và một cuốn sách hay.",
        author: "Bill Watterson",
    }
]

export function randomQuotation() {
    return quotations[Math.floor(Math.random() * quotations.length)];
}