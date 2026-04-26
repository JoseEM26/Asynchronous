import UIKit
import MapKit

class AttendanceDetailViewController: UIViewController {
    
    var asistencia: AsistenciaResponse?
    
    private let scrollView = UIScrollView()
    private let contentStack = UIStackView()
    private let mapView = MKMapView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Detalle de Asistencia"
        
        view.backgroundColor = .systemGroupedBackground
        view.layer.cornerRadius = 30
        view.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        view.clipsToBounds = true
        
        // Botón cerrar
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .close,
            target: self,
            action: #selector(closeTapped)
        )
        navigationItem.rightBarButtonItem?.tintColor = .systemOrange
        
        setupUI()
        populateData()
    }
    
    @objc private func closeTapped() {
        dismiss(animated: true)
    }
    
    private func setupUI() {
        // ScrollView
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        
        // Content stack
        contentStack.axis = .vertical
        contentStack.spacing = 16
        contentStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentStack)
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentStack.topAnchor.constraint(equalTo: scrollView.topAnchor, constant: 16),
            contentStack.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor, constant: 20),
            contentStack.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor, constant: -20),
            contentStack.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor, constant: -30),
            contentStack.widthAnchor.constraint(equalTo: scrollView.widthAnchor, constant: -40),
        ])
    }
    
    private func populateData() {
        guard let item = asistencia else { return }
        
        let tipo = item.tipo ?? "REGISTRO"
        let isEntrada = tipo == "ENTRADA"
        
        // ===== HEADER CARD =====
        let headerCard = makeCard()
        let headerStack = UIStackView()
        headerStack.axis = .horizontal
        headerStack.spacing = 16
        headerStack.alignment = .center
        headerStack.translatesAutoresizingMaskIntoConstraints = false
        headerCard.addSubview(headerStack)
        
        // Icono grande
        let iconBg = UIView()
        iconBg.backgroundColor = (isEntrada ? UIColor.systemGreen : UIColor.systemRed).withAlphaComponent(0.15)
        iconBg.layer.cornerRadius = 30
        iconBg.translatesAutoresizingMaskIntoConstraints = false
        
        let iconLabel = UILabel()
        iconLabel.text = isEntrada ? "↓" : "↑"
        iconLabel.font = .systemFont(ofSize: 30, weight: .bold)
        iconLabel.textColor = isEntrada ? .systemGreen : .systemRed
        iconLabel.textAlignment = .center
        iconLabel.translatesAutoresizingMaskIntoConstraints = false
        iconBg.addSubview(iconLabel)
        
        NSLayoutConstraint.activate([
            iconBg.widthAnchor.constraint(equalToConstant: 60),
            iconBg.heightAnchor.constraint(equalToConstant: 60),
            iconLabel.centerXAnchor.constraint(equalTo: iconBg.centerXAnchor),
            iconLabel.centerYAnchor.constraint(equalTo: iconBg.centerYAnchor),
        ])
        
        // Texto header
        let headerTextStack = UIStackView()
        headerTextStack.axis = .vertical
        headerTextStack.spacing = 4
        
        let tipoLabel = UILabel()
        tipoLabel.text = tipo
        tipoLabel.font = .systemFont(ofSize: 26, weight: .bold)
        tipoLabel.textColor = isEntrada ? .systemGreen : .systemRed
        
        let statusLabel = UILabel()
        statusLabel.text = isEntrada ? "Registro de entrada" : "Registro de salida"
        statusLabel.font = .systemFont(ofSize: 14, weight: .regular)
        statusLabel.textColor = .secondaryLabel
        
        headerTextStack.addArrangedSubview(tipoLabel)
        headerTextStack.addArrangedSubview(statusLabel)
        
        headerStack.addArrangedSubview(iconBg)
        headerStack.addArrangedSubview(headerTextStack)
        
        NSLayoutConstraint.activate([
            headerStack.topAnchor.constraint(equalTo: headerCard.topAnchor, constant: 20),
            headerStack.leadingAnchor.constraint(equalTo: headerCard.leadingAnchor, constant: 20),
            headerStack.trailingAnchor.constraint(equalTo: headerCard.trailingAnchor, constant: -20),
            headerStack.bottomAnchor.constraint(equalTo: headerCard.bottomAnchor, constant: -20),
        ])
        
        contentStack.addArrangedSubview(headerCard)
        
        // ===== DETALLES CARD =====
        let detailCard = makeCard()
        let detailStack = UIStackView()
        detailStack.axis = .vertical
        detailStack.spacing = 14
        detailStack.translatesAutoresizingMaskIntoConstraints = false
        detailCard.addSubview(detailStack)
        
        // Fecha
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE dd 'de' MMMM yyyy"
        formatter.locale = Locale(identifier: "es_PE")
        let fechaStr = item.fechaHora != nil ? formatter.string(from: item.fechaHora!) : "Desconocida"
        
        let timeFormatter = DateFormatter()
        timeFormatter.dateFormat = "HH:mm:ss"
        let horaStr = item.fechaHora != nil ? timeFormatter.string(from: item.fechaHora!) : "--:--"
        
        detailStack.addArrangedSubview(makeDetailRow(icon: "📅", title: "Fecha", value: fechaStr.capitalized))
        detailStack.addArrangedSubview(makeSeparator())
        detailStack.addArrangedSubview(makeDetailRow(icon: "🕐", title: "Hora", value: horaStr))
        detailStack.addArrangedSubview(makeSeparator())
        detailStack.addArrangedSubview(makeDetailRow(icon: "📍", title: "Modalidad", value: item.modalidad?.nombre ?? "No especificada"))
        detailStack.addArrangedSubview(makeSeparator())
        
        // Trabajador
        if let t = item.trabajador {
            let nombre = "\(t.nombres ?? "") \(t.apellidos ?? "")"
            detailStack.addArrangedSubview(makeDetailRow(icon: "👤", title: "Trabajador", value: nombre))
            detailStack.addArrangedSubview(makeSeparator())
            detailStack.addArrangedSubview(makeDetailRow(icon: "📋", title: "DNI", value: t.dni ?? "N/A"))
            detailStack.addArrangedSubview(makeSeparator())
        }
        
        // Notas
        let notas = item.notas ?? "Sin notas"
        detailStack.addArrangedSubview(makeDetailRow(icon: "📝", title: "Notas", value: notas))
        
        // Coordenadas
        if let lat = item.latitud, let lng = item.longitud {
            detailStack.addArrangedSubview(makeSeparator())
            detailStack.addArrangedSubview(makeDetailRow(icon: "🌐", title: "Coordenadas", value: String(format: "%.6f, %.6f", lat, lng)))
        }
        
        NSLayoutConstraint.activate([
            detailStack.topAnchor.constraint(equalTo: detailCard.topAnchor, constant: 20),
            detailStack.leadingAnchor.constraint(equalTo: detailCard.leadingAnchor, constant: 20),
            detailStack.trailingAnchor.constraint(equalTo: detailCard.trailingAnchor, constant: -20),
            detailStack.bottomAnchor.constraint(equalTo: detailCard.bottomAnchor, constant: -20),
        ])
        
        contentStack.addArrangedSubview(detailCard)
        
        // ===== MAPA CARD =====
        if let lat = item.latitud, let lng = item.longitud {
            let mapCard = makeCard()
            
            let mapTitle = UILabel()
            mapTitle.text = "📍 Ubicación del registro"
            mapTitle.font = .systemFont(ofSize: 17, weight: .semibold)
            mapTitle.textColor = UIColor { trait in
                trait.userInterfaceStyle == .dark ? .white : UIColor(white: 0.15, alpha: 1.0)
            }
            mapTitle.translatesAutoresizingMaskIntoConstraints = false
            mapCard.addSubview(mapTitle)
            
            mapView.translatesAutoresizingMaskIntoConstraints = false
            mapView.layer.cornerRadius = 20
            mapView.clipsToBounds = true
            mapView.isZoomEnabled = true
            mapView.isScrollEnabled = true
            mapCard.addSubview(mapView)
            
            // Centrar mapa en la ubicación
            let coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lng)
            let region = MKCoordinateRegion(
                center: coordinate,
                latitudinalMeters: 300,
                longitudinalMeters: 300
            )
            mapView.setRegion(region, animated: false)
            
            // Pin
            let annotation = MKPointAnnotation()
            annotation.coordinate = coordinate
            annotation.title = tipo
            annotation.subtitle = fechaStr
            mapView.addAnnotation(annotation)
            
            NSLayoutConstraint.activate([
                mapTitle.topAnchor.constraint(equalTo: mapCard.topAnchor, constant: 16),
                mapTitle.leadingAnchor.constraint(equalTo: mapCard.leadingAnchor, constant: 20),
                mapTitle.trailingAnchor.constraint(equalTo: mapCard.trailingAnchor, constant: -20),
                
                mapView.topAnchor.constraint(equalTo: mapTitle.bottomAnchor, constant: 12),
                mapView.leadingAnchor.constraint(equalTo: mapCard.leadingAnchor, constant: 16),
                mapView.trailingAnchor.constraint(equalTo: mapCard.trailingAnchor, constant: -16),
                mapView.heightAnchor.constraint(equalToConstant: 250),
                mapView.bottomAnchor.constraint(equalTo: mapCard.bottomAnchor, constant: -16),
            ])
            
            contentStack.addArrangedSubview(mapCard)
        }
    }
    
    // MARK: - Helpers
    
    private func makeCard() -> UIView {
        let card = UIView()
        card.backgroundColor = UIColor { trait in
            trait.userInterfaceStyle == .dark
                ? UIColor(red: 0.15, green: 0.15, blue: 0.18, alpha: 1.0)
                : .white
        }
        card.layer.cornerRadius = 16
        card.layer.shadowColor = UIColor.black.cgColor
        card.layer.shadowOpacity = 0.06
        card.layer.shadowOffset = CGSize(width: 0, height: 2)
        card.layer.shadowRadius = 8
        card.translatesAutoresizingMaskIntoConstraints = false
        return card
    }
    
    private func makeDetailRow(icon: String, title: String, value: String) -> UIView {
        let row = UIStackView()
        row.axis = .horizontal
        row.spacing = 10
        row.alignment = .top
        
        let titleLabel = UILabel()
        titleLabel.text = "\(icon)  \(title)"
        titleLabel.font = .systemFont(ofSize: 14, weight: .medium)
        titleLabel.textColor = .secondaryLabel
        titleLabel.setContentHuggingPriority(.required, for: .horizontal)
        titleLabel.widthAnchor.constraint(equalToConstant: 130).isActive = true
        
        let valueLabel = UILabel()
        valueLabel.text = value
        valueLabel.font = .systemFont(ofSize: 15, weight: .semibold)
        valueLabel.textColor = UIColor { trait in
            trait.userInterfaceStyle == .dark ? .white : UIColor(white: 0.15, alpha: 1.0)
        }
        valueLabel.numberOfLines = 0
        valueLabel.textAlignment = .right
        
        row.addArrangedSubview(titleLabel)
        row.addArrangedSubview(valueLabel)
        return row
    }
    
    private func makeSeparator() -> UIView {
        let sep = UIView()
        sep.backgroundColor = UIColor.separator.withAlphaComponent(0.3)
        sep.heightAnchor.constraint(equalToConstant: 0.5).isActive = true
        return sep
    }
}
