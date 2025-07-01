import Header from "@/app/components/Header";
import NextTopLoader from "nextjs-toploader";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <NextTopLoader
            color="#508991"
            height={4}
            showSpinner={false}
            easing="ease"
            shadow="0 0 10px #508991,0 0 5px #508991"
            zIndex={1600}
            showAtBottom={false}
        />
        <Header />
        <div className="container mt-28 mb-16">{children}</div>
    </>
  );
}