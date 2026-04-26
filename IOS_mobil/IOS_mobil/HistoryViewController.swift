import UIKit

class HistoryViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    var usuarioId: Int?
    private var todasAsistencias: [AsistenciaResponse] = []
    private var asistenciasFiltradas: [AsistenciaResponse] = []
    
    private let tableView = UITableView(frame: .zero, style: .plain)
    private let refreshControl = UIRefreshControl()
    
    private let filterSegment: UISegmentedControl = {
        let sc = UISegmentedControl(items: ["Todos", "Entradas", "Salidas"])
        sc.selectedSegmentIndex = 0
        sc.selectedSegmentTintColor = .systemOrange
        sc.setTitleTextAttributes([.foregroundColor: UIColor.white], for: .selected)
        sc.translatesAutoresizingMaskIntoConstraints = false
        return sc
    }()
    
    private let emptyLabel: UILabel = {
        let lbl = UILabel()
        lbl.text = "📭\nSin registros de asistencia"
        lbl.numberOfLines = 0
        lbl.textAlignment = .center
        lbl.font = .systemFont(ofSize: 17, weight: .medium)
        lbl.textColor = .secondaryLabel
        lbl.isHidden = true
        lbl.translatesAutoresizingMaskIntoConstraints = false
        return lbl
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "📅 Mi Historial"
        
        view.backgroundColor = .systemGroupedBackground
        view.layer.cornerRadius = 30
        view.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        view.clipsToBounds = true
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .close,
            target: self,
            action: #selector(closeTapped)
        )
        navigationItem.rightBarButtonItem?.tintColor = .systemOrange
        
        setupUI()
        loadHistory()
    }
    
    @objc private func closeTapped() {
        dismiss(animated: true)
    }

    private func setupUI() {
        view.addSubview(filterSegment)
        view.addSubview(tableView)
        view.addSubview(emptyLabel)
        
        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.backgroundColor = .clear
        tableView.separatorStyle = .none
        
        NSLayoutConstraint.activate([
            filterSegment.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 12),
            filterSegment.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            filterSegment.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            filterSegment.heightAnchor.constraint(equalToConstant: 36),
            
            tableView.topAnchor.constraint(equalTo: filterSegment.bottomAnchor, constant: 12),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
        ])
        
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        
        refreshControl.tintColor = .systemOrange
        tableView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(loadHistory), for: .valueChanged)
        
        filterSegment.addTarget(self, action: #selector(filterChanged), for: .valueChanged)
    }

    @objc private func filterChanged() {
        let generator = UISelectionFeedbackGenerator()
        generator.selectionChanged()
        
        applyFilter()
    }

    private func applyFilter() {
        switch filterSegment.selectedSegmentIndex {
        case 1: // Entradas
            asistenciasFiltradas = todasAsistencias.filter { $0.tipo == "ENTRADA" }
        case 2: // Salidas
            asistenciasFiltradas = todasAsistencias.filter { $0.tipo == "SALIDA" }
        default: // Todos
            asistenciasFiltradas = todasAsistencias
        }
        
        tableView.reloadData()
        emptyLabel.isHidden = !asistenciasFiltradas.isEmpty
        
        if asistenciasFiltradas.isEmpty {
            emptyLabel.text = filterSegment.selectedSegmentIndex == 0 ? "📭\nSin registros" : "🔍\nNo hay registros para este filtro"
        }
    }

    @objc private func loadHistory() {
        guard let id = usuarioId else { return }
        
        NetworkManager.shared.getAsistenciasPorTrabajador(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.refreshControl.endRefreshing()
                switch result {
                case .success(let data):
                    self?.todasAsistencias = data.sorted(by: { ($0.fechaHora ?? Date()) > ($1.fechaHora ?? Date()) })
                    self?.applyFilter()
                case .failure:
                    self?.emptyLabel.isHidden = false
                    self?.emptyLabel.text = "❌\nError al cargar historial"
                }
            }
        }
    }

    // MARK: - TableView
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return asistenciasFiltradas.count
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 90
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .subtitle, reuseIdentifier: "cell")
        let item = asistenciasFiltradas[indexPath.row]
        
        let tipo = item.tipo ?? "REGISTRO"
        let isEntrada = tipo == "ENTRADA"
        
        let formatter = DateFormatter()
        formatter.dateFormat = "dd MMM yyyy  •  HH:mm"
        formatter.locale = Locale(identifier: "es_PE")
        let dateString = item.fechaHora != nil ? formatter.string(from: item.fechaHora!) : "Fecha desconocida"
        
        cell.backgroundColor = .clear
        cell.selectionStyle = .none
        cell.contentView.subviews.forEach { $0.removeFromSuperview() }
        
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
        cell.contentView.addSubview(card)
        
        let indicator = UIView()
        indicator.backgroundColor = isEntrada ? .systemGreen : .systemRed
        indicator.layer.cornerRadius = 3
        indicator.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(indicator)
        
        let iconBg = UIView()
        iconBg.backgroundColor = (isEntrada ? UIColor.systemGreen : UIColor.systemRed).withAlphaComponent(0.12)
        iconBg.layer.cornerRadius = 22
        iconBg.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(iconBg)
        
        let iconLabel = UILabel()
        iconLabel.text = isEntrada ? "↓" : "↑"
        iconLabel.font = .systemFont(ofSize: 22, weight: .bold)
        iconLabel.textColor = isEntrada ? .systemGreen : .systemRed
        iconLabel.textAlignment = .center
        iconLabel.translatesAutoresizingMaskIntoConstraints = false
        iconBg.addSubview(iconLabel)
        
        let titleLbl = UILabel()
        titleLbl.text = tipo
        titleLbl.font = .systemFont(ofSize: 17, weight: .semibold)
        titleLbl.textColor = UIColor { trait in
            trait.userInterfaceStyle == .dark ? .white : UIColor(white: 0.15, alpha: 1.0)
        }
        titleLbl.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(titleLbl)
        
        let subtitleLbl = UILabel()
        let modalidad = item.modalidad?.nombre ?? ""
        subtitleLbl.text = "\(dateString)  •  \(modalidad)"
        subtitleLbl.font = .systemFont(ofSize: 13, weight: .regular)
        subtitleLbl.textColor = .secondaryLabel
        subtitleLbl.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(subtitleLbl)
        
        NSLayoutConstraint.activate([
            card.topAnchor.constraint(equalTo: cell.contentView.topAnchor, constant: 4),
            card.leadingAnchor.constraint(equalTo: cell.contentView.leadingAnchor, constant: 16),
            card.trailingAnchor.constraint(equalTo: cell.contentView.trailingAnchor, constant: -16),
            card.bottomAnchor.constraint(equalTo: cell.contentView.bottomAnchor, constant: -4),
            
            indicator.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 6),
            indicator.centerYAnchor.constraint(equalTo: card.centerYAnchor),
            indicator.widthAnchor.constraint(equalToConstant: 4),
            indicator.heightAnchor.constraint(equalToConstant: 36),
            
            iconBg.leadingAnchor.constraint(equalTo: indicator.trailingAnchor, constant: 12),
            iconBg.centerYAnchor.constraint(equalTo: card.centerYAnchor),
            iconBg.widthAnchor.constraint(equalToConstant: 44),
            iconBg.heightAnchor.constraint(equalToConstant: 44),
            
            iconLabel.centerXAnchor.constraint(equalTo: iconBg.centerXAnchor),
            iconLabel.centerYAnchor.constraint(equalTo: iconBg.centerYAnchor),
            
            titleLbl.topAnchor.constraint(equalTo: card.topAnchor, constant: 16),
            titleLbl.leadingAnchor.constraint(equalTo: iconBg.trailingAnchor, constant: 14),
            titleLbl.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -16),
            
            subtitleLbl.topAnchor.constraint(equalTo: titleLbl.bottomAnchor, constant: 4),
            subtitleLbl.leadingAnchor.constraint(equalTo: titleLbl.leadingAnchor),
            subtitleLbl.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -16),
        ])
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let item = asistenciasFiltradas[indexPath.row]
        
        let detailVC = AttendanceDetailViewController()
        detailVC.asistencia = item
        let nav = UINavigationController(rootViewController: detailVC)
        if #available(iOS 15.0, *) {
            nav.modalPresentationStyle = .pageSheet
            if let sheet = nav.sheetPresentationController {
                sheet.detents = [.large()]
                sheet.prefersGrabberVisible = true
                sheet.preferredCornerRadius = 30
            }
        }
        present(nav, animated: true)
    }
}
