import UIKit

class ReservasViewController: UIViewController {

    @IBOutlet weak var lblTituloEstado: UILabel!
    @IBOutlet weak var lblDescripcionEstado: UILabel!
    @IBOutlet weak var progressReserva: UIProgressView!
    @IBOutlet weak var txtBitacora: UITextView!
    @IBOutlet weak var btnIniciarProceso: UIButton!
    @IBOutlet weak var btnLimpiar: UIButton!
    @IBOutlet weak var vistaPanel: UIView!

    override func viewDidLoad() {
        super.viewDidLoad()

        title = "Reservas"
        view.backgroundColor = UIColor(red: 0.91, green: 0.95, blue: 0.98, alpha: 1.0)

        // Configuracion visual del panel central.
        vistaPanel.layer.cornerRadius = 28
        vistaPanel.layer.shadowColor = UIColor.black.cgColor
        vistaPanel.layer.shadowOpacity = 0.12
        vistaPanel.layer.shadowOffset = CGSize(width: 0, height: 10)
        vistaPanel.layer.shadowRadius = 16

        progressReserva.progress = 0
        progressReserva.layer.cornerRadius = 6
        progressReserva.clipsToBounds = true

        txtBitacora.layer.cornerRadius = 18
        txtBitacora.text = "Bitacora del proceso:\n\nPresione \"Iniciar reserva\" para simular tareas en segundo plano."
    }

    @IBAction func btnIniciarProceso(_ sender: UIButton) {
        iniciarReservaEnSegundoPlano()
    }

    @IBAction func btnLimpiar(_ sender: UIButton) {
        progressReserva.progress = 0
        lblTituloEstado.text = "Estado actual"
        lblDescripcionEstado.text = "La simulacion aun no ha comenzado."
        txtBitacora.text = "Bitacora del proceso:\n\nPresione \"Iniciar reserva\" para simular tareas en segundo plano."
        btnIniciarProceso.isEnabled = true
    }

    private func iniciarReservaEnSegundoPlano() {
        btnIniciarProceso.isEnabled = false
        progressReserva.progress = 0
        lblTituloEstado.text = "Preparando busqueda"
        lblDescripcionEstado.text = "La app comenzara un proceso simulado fuera del hilo principal."
        txtBitacora.text = "Bitacora del proceso:\n"

        // Paso docente:
        // DispatchQueue.global ejecuta trabajo en segundo plano.
        // Esto evita bloquear la interfaz mientras el proceso tarda.
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            self?.ejecutarPasoReserva(
                titulo: "Buscando vuelos",
                detalle: "Consultando disponibilidad en segundo plano.",
                progreso: 0.33,
                espera: 1.2
            )

            self?.ejecutarPasoReserva(
                titulo: "Descargando itinerario",
                detalle: "Armando el resumen del viaje sin congelar la pantalla.",
                progreso: 0.66,
                espera: 1.4
            )

            self?.ejecutarPasoReserva(
                titulo: "Confirmando reserva",
                detalle: "Terminando el proceso y preparando la respuesta final.",
                progreso: 1.0,
                espera: 1.0
            )

            // Paso docente:
            // Toda actualizacion de la interfaz debe volver al hilo principal.
            DispatchQueue.main.async { [weak self] in
                self?.lblTituloEstado.text = "Reserva completada"
                self?.lblDescripcionEstado.text = "La simulacion finalizo correctamente y la interfaz sigue respondiendo."
                self?.agregarLineaBitacora("Proceso finalizado. La interfaz fue actualizada desde el hilo principal.")
                self?.btnIniciarProceso.isEnabled = true
            }
        }
    }

    private func ejecutarPasoReserva(titulo: String, detalle: String, progreso: Float, espera: TimeInterval) {
        Thread.sleep(forTimeInterval: espera)

        DispatchQueue.main.async { [weak self] in
            self?.lblTituloEstado.text = titulo
            self?.lblDescripcionEstado.text = detalle
            self?.progressReserva.setProgress(progreso, animated: true)
            self?.agregarLineaBitacora("\(titulo): \(detalle)")
        }
    }

    private func agregarLineaBitacora(_ texto: String) {
        txtBitacora.text += "\n- \(texto)"

        let rangoFinal = NSRange(location: txtBitacora.text.count - 1, length: 1)
        txtBitacora.scrollRangeToVisible(rangoFinal)
    }
}
