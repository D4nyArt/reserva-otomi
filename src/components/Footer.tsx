export default function Footer() {
    return (
        <footer id="contacto" className="relative bg-forest-950 text-white">
            {/* Top decorative border */}
            <div className="h-1 bg-gradient-to-r from-forest-500 via-water-500 to-earth-500" />

            <div className="mx-auto max-w-5xl px-6 py-20">
                <div className="grid items-center gap-16 md:grid-cols-2">
                    {/* Brand */}
                    <div className="text-center md:text-left">
                        <div className="font-heading mb-5 text-3xl font-bold md:text-4xl">
                            <span className="text-forest-400">Agua</span> Barranca
                        </div>
                        <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-white/60 md:mx-0">
                            Preservamos el patrimonio natural y cultural otomí de la zona de San Jerónimo Acazulco.
                        </p>
                        {/* Social icons */}
                        <div className="flex justify-center gap-4 md:justify-start">
                            <a
                                href="https://www.facebook.com/profile.php?id=100083171650116"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-forest-400 hover:bg-forest-400/10 hover:text-forest-400"
                            >
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://wa.me/527224271176"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-forest-400 hover:bg-forest-400/10 hover:text-forest-400"
                            >
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="text-center md:text-left">
                        <h4 className="font-heading mb-5 text-base font-bold tracking-widest text-forest-400 uppercase">
                            Ubicación
                        </h4>
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <iframe
                                title="Ubicación de San Jerónimo Acazulco"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.9564059381464!2d-99.4241375!3d19.2842619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cdf7003fb5ddab%3A0xcb49b714f89d48f6!2zUmVzZXJ2YSBlY29sw7NnaWNhIG90b23DrSBOZGVqw6sgw5FlIExlbmfDvA!5e0!3m2!1sen!2smx!4v1773253209145!5m2!1sen!2smx"
                                width="100%"
                                height="220"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale-[30%] contrast-[1.1]"
                            />
                        </div>
                        <a
                            href="https://maps.app.goo.gl/sdqWUW8HvHHSuhSD6?g_st=iw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm text-forest-400 transition-colors hover:text-forest-300"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            Abrir en Google Maps
                        </a>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 border-t border-white/10 pt-8 text-center">
                    <p className="text-sm text-white/40">
                        © 2026 Agradecimientos al los alumnos del Tecnológico de Monterrey por su apoyo y asesoría durante el desarrollo de esta página web.
                    </p>
                </div>
            </div>
        </footer>
    );
}
