import UIKit

class TeamListViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    var jefeId: Int?
    private var trabajadores: [TrabajadorSimpleResponse] = []

    private let tableView: UITableView = {
        let tv = UITableView(frame: .zero, style: .insetGrouped)
        tv.translatesAutoresizingMaskIntoConstraints = false
        tv.register(UITableViewCell.self, forCellReuseIdentifier: "WorkerCell")
        return tv
    }()

    private let emptyLabel: UILabel = {
        let l = UILabel()
        l.text = "No tienes trabajadores asignados"
        l.textColor = .secondaryLabel
        l.font = .systemFont(ofSize: 16, weight: .medium)
        l.textAlignment = .center
        l.isHidden = true
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()

    private let activityIndicator = UIActivityIndicatorView(style: .large)

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "👥 Mi Equipo"
        view.backgroundColor = .systemGroupedBackground
        view.layer.cornerRadius = 30
        view.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        view.clipsToBounds = true
        navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(dismissView))

        tableView.delegate = self
        tableView.dataSource = self

        view.addSubview(tableView)
        view.addSubview(emptyLabel)
        view.addSubview(activityIndicator)
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),

            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])

        fetchTeam()
    }

    private func fetchTeam() {
        guard let id = jefeId else { return }
        activityIndicator.startAnimating()
        NetworkManager.shared.getTrabajadoresPorJefe(jefeId: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                switch result {
                case .success(let lista):
                    self?.trabajadores = lista
                    self?.emptyLabel.isHidden = !lista.isEmpty
                    self?.tableView.isHidden = lista.isEmpty
                    self?.tableView.reloadData()
                case .failure:
                    self?.emptyLabel.text = "Error al cargar el equipo"
                    self?.emptyLabel.isHidden = false
                }
            }
        }
    }

    // MARK: - TableView
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return trabajadores.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "WorkerCell", for: indexPath)
        let t = trabajadores[indexPath.row]

        var config = cell.defaultContentConfiguration()
        let nombre = "\(t.nombres ?? "") \(t.apellidos ?? "")"
        config.text = nombre.trimmingCharacters(in: .whitespaces)
        
        var details: [String] = []
        if let modalidad = t.modalidadNombre { details.append(modalidad) }
        if let dni = t.dni { details.append("DNI: \(dni)") }
        config.secondaryText = details.joined(separator: " • ")
        
        config.image = UIImage(systemName: "person.fill")
        config.imageProperties.tintColor = .systemOrange

        cell.contentConfiguration = config
        cell.accessoryType = .disclosureIndicator
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        // Futuro: navegar al detalle del trabajador
    }

    @objc private func dismissView() {
        dismiss(animated: true)
    }
}
