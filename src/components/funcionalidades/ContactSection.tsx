import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function ContactSection() {
    return (
        <section id="contact" className="py-24 bg-muted/30">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-6">
                    Ponte en contacto
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                    Si tienes alguna pregunta, comentario o sugerencia, no dudes en ponerte en contacto con nosotros. Puedes comunicarte con nuestro equipo de soporte a través de la aplicación o enviarnos un correo electrónico a <strong>soporte.inversionlibre@gmail.com</strong>.
                </p>
                <p className="text-lg text-muted-foreground mb-10">
                    Estamos aquí para ayudarte a tener éxito en tu viaje financiero.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-8 shadow-lg w-full sm:w-auto" asChild>
                        <a href="mailto:soporte.inversionlibre@gmail.com">
                            <Mail className="mr-2 h-5 w-5" /> ¡Contáctanos!
                        </a>
                    </Button>
                    <div className="text-muted-foreground font-medium text-sm sm:ml-4">
                        soporte.inversionlibre@gmail.com
                    </div>
                </div>
            </div>
        </section>
    )
}
