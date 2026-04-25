import UIKit

class HistoryViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    var usuarioId: Int?
    private var asistencias: [AsistenciaResponse] = []
    private let tableView = UITableView()
    private let refreshControl = UIRefreshControl()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Mi Historial"
        view.backgroundColor = .white
        setupTableView()
        loadHistory()
    }

    private func setupTableView() {
        view.addSubview(tableView)
        tableView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        
        tableView.refreshControl = refreshControl
        refreshControl.addTarget(self, action: #selector(loadHistory), for: .valueChanged)
    }

    @objc private func loadHistory() {
        guard let id = usuarioId else { return }
        
        NetworkManager.shared.getAsistenciasPorTrabajador(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.refreshControl.endRefreshing()
                switch result {
                case .success(let data):
                    self?.asistencias = data.sorted(by: { ($0.fechaHora ?? Date()) > ($1.fechaHora ?? Date()) })
                    self?.tableView.reloadData()
                case .failure:
                    print("Error cargando historial")
                }
            }
        }
    }

    // MARK: - TableView Methods
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return asistencias.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .subtitle, reuseIdentifier: "cell")
        let item = asistencias[indexPath.row]
        
        let tipo = item.tipo ?? "REGISTRO"
        
        let formatter = DateFormatter()
        formatter.dateFormat = "dd/MM/yyyy HH:mm"
        let dateString = item.fechaHora != nil ? formatter.string(from: item.fechaHora!) : "Fecha desconocida"
        
        cell.textLabel?.text = "\(tipo) - \(dateString)"
        cell.textLabel?.font = .boldSystemFont(ofSize: 16)
        cell.textLabel?.textColor = tipo == "ENTRADA" ? .systemGreen : .systemRed
        
        cell.detailTextLabel?.text = "Modalidad: \(item.modalidad?.nombre ?? "No especificada")"
        cell.detailTextLabel?.textColor = .darkGray
        
        cell.accessoryType = .disclosureIndicator
        return cell
    }
}
