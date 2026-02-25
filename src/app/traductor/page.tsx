import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Traductor from "@/components/Traductor";

export default function TraductorPage() {
    return (
        <>
            <Navbar />
            <main>
                <Traductor />
            </main>
            <Footer />
        </>
    );
}