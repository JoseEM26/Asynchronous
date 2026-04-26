import UIKit

class ProfileViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    // MARK: - UI Components
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let headerView: UIView = {
        let v = UIView()
        v.backgroundColor = .systemOrange
        v.translatesAutoresizingMaskIntoConstraints = false
        return v
    }()
    
    private let avatarImageView: UIImageView = {
        let iv = UIImageView()
        iv.backgroundColor = .systemGray6
        iv.layer.cornerRadius = 75
        iv.contentMode = .scaleAspectFill
        iv.clipsToBounds = true
        iv.layer.borderWidth = 4
        iv.layer.borderColor = UIColor.white.cgColor
        iv.image = UIImage(systemName: "person.circle.fill")
        iv.tintColor = .systemGray4
        iv.translatesAutoresizingMaskIntoConstraints = false
        return iv
    }()
    
    private let changePhotoButton: UIButton = {
        let b = UIButton(type: .system)
        let config = UIImage.SymbolConfiguration(pointSize: 18, weight: .bold)
        b.setImage(UIImage(systemName: "camera.fill", withConfiguration: config), for: .normal)
        b.backgroundColor = .white
        b.tintColor = .systemOrange
        b.layer.cornerRadius = 20
        b.layer.shadowOpacity = 0.2
        b.layer.shadowRadius = 4
        b.layer.shadowOffset = CGSize(width: 0, height: 2)
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()
    
    private let nameLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 26, weight: .bold)
        l.textAlignment = .center
        l.textColor = .label
        l.text = "Cargando..."
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let roleBadge: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 14, weight: .bold)
        l.textColor = .white
        l.backgroundColor = .systemOrange
        l.textAlignment = .center
        l.layer.cornerRadius = 12
        l.clipsToBounds = true
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
    
    private let infoStack: UIStackView = {
        let s = UIStackView()
        s.axis = .vertical
        s.spacing = 16
        s.translatesAutoresizingMaskIntoConstraints = false
        return s
    }()
    
    private let activityIndicator: UIActivityIndicatorView = {
        let ai = UIActivityIndicatorView(style: .large)
        ai.color = .systemOrange
        ai.hidesWhenStopped = true
        ai.translatesAutoresizingMaskIntoConstraints = false
        return ai
    }()

    var trabajadorId: Int?
    
    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadProfileData()
        loadAvatar()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: true)
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        
        contentView.addSubview(headerView)
        contentView.addSubview(avatarImageView)
        contentView.addSubview(changePhotoButton)
        contentView.addSubview(nameLabel)
        contentView.addSubview(roleBadge)
        contentView.addSubview(infoStack)
        view.addSubview(activityIndicator)
        
        // Botón cerrar
        let closeBtn = UIButton(type: .system)
        closeBtn.setImage(UIImage(systemName: "xmark.circle.fill"), for: .normal)
        closeBtn.tintColor = .white
        closeBtn.addTarget(self, action: #selector(closeTapped), for: .touchUpInside)
        closeBtn.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(closeBtn)
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            headerView.topAnchor.constraint(equalTo: contentView.topAnchor),
            headerView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            headerView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            headerView.heightAnchor.constraint(equalToConstant: 180),
            
            closeBtn.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 10),
            closeBtn.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            closeBtn.widthAnchor.constraint(equalToConstant: 35),
            closeBtn.heightAnchor.constraint(equalToConstant: 35),
            
            avatarImageView.centerYAnchor.constraint(equalTo: headerView.bottomAnchor),
            avatarImageView.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            avatarImageView.widthAnchor.constraint(equalToConstant: 150),
            avatarImageView.heightAnchor.constraint(equalToConstant: 150),
            
            changePhotoButton.bottomAnchor.constraint(equalTo: avatarImageView.bottomAnchor, constant: -5),
            changePhotoButton.trailingAnchor.constraint(equalTo: avatarImageView.trailingAnchor, constant: -5),
            changePhotoButton.widthAnchor.constraint(equalToConstant: 40),
            changePhotoButton.heightAnchor.constraint(equalToConstant: 40),
            
            nameLabel.topAnchor.constraint(equalTo: avatarImageView.bottomAnchor, constant: 16),
            nameLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            nameLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            roleBadge.topAnchor.constraint(equalTo: nameLabel.bottomAnchor, constant: 8),
            roleBadge.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            roleBadge.widthAnchor.constraint(greaterThanOrEqualToConstant: 120),
            roleBadge.heightAnchor.constraint(equalToConstant: 24),
            
            infoStack.topAnchor.constraint(equalTo: roleBadge.bottomAnchor, constant: 30),
            infoStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 24),
            infoStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -24),
            infoStack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -40),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
        
        changePhotoButton.addTarget(self, action: #selector(changePhotoTapped), for: .touchUpInside)
    }
    
    private func createInfoRow(icon: String, title: String, value: String, color: UIColor = .systemGray) -> UIView {
        let container = UIView()
        let iconView = UIImageView(image: UIImage(systemName: icon))
        iconView.tintColor = color
        iconView.contentMode = .scaleAspectFit
        iconView.translatesAutoresizingMaskIntoConstraints = false
        
        let titleLabel = UILabel()
        titleLabel.text = title.uppercased()
        titleLabel.font = .systemFont(ofSize: 10, weight: .bold)
        titleLabel.textColor = .secondaryLabel
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let valueLabel = UILabel()
        valueLabel.text = value
        valueLabel.font = .systemFont(ofSize: 15, weight: .medium)
        valueLabel.textColor = .label
        valueLabel.numberOfLines = 0
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
        
        container.addSubview(iconView)
        container.addSubview(titleLabel)
        container.addSubview(valueLabel)
        
        NSLayoutConstraint.activate([
            iconView.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            iconView.topAnchor.constraint(equalTo: container.topAnchor, constant: 4),
            iconView.widthAnchor.constraint(equalToConstant: 20),
            iconView.heightAnchor.constraint(equalToConstant: 20),
            
            titleLabel.topAnchor.constraint(equalTo: container.topAnchor),
            titleLabel.leadingAnchor.constraint(equalTo: iconView.trailingAnchor, constant: 12),
            titleLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            
            valueLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 2),
            valueLabel.leadingAnchor.constraint(equalTo: titleLabel.leadingAnchor),
            valueLabel.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            valueLabel.bottomAnchor.constraint(equalTo: container.bottomAnchor)
        ])
        
        return container
    }

    private func loadProfileData() {
        guard let id = trabajadorId else { return }
        activityIndicator.startAnimating()
        NetworkManager.shared.getUsuario(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.activityIndicator.stopAnimating()
                if case .success(let u) = result { self?.updateUI(with: u) }
            }
        }
    }

    private func updateUI(with u: UsuarioResponse) {
        let t = u.trabajador
        nameLabel.text = t != nil ? "\(t?.nombres ?? "") \(t?.apellidos ?? "")" : u.username.capitalized
        roleBadge.text = "  \(u.rol?.nombre ?? "USUARIO")  "
        infoStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        infoStack.addArrangedSubview(createInfoSectionTitle("DATOS DE CUENTA"))
        infoStack.addArrangedSubview(createInfoRow(icon: "person.fill", title: "USUARIO", value: u.username, color: .systemBlue))
        infoStack.addArrangedSubview(createInfoRow(icon: "number", title: "ID SISTEMA", value: "\(u.id)", color: .systemGray))
        
        if let t = t {
            infoStack.addArrangedSubview(createInfoSectionTitle("DATOS PERSONALES"))
            infoStack.addArrangedSubview(createInfoRow(icon: "doc.text.fill", title: "DNI", value: t.dni ?? "No registrado", color: .systemOrange))
            infoStack.addArrangedSubview(createInfoRow(icon: "phone.fill", title: "TELÉFONO", value: t.telefono ?? "No registrado", color: .systemGreen))
            infoStack.addArrangedSubview(createInfoRow(icon: "mappin.and.ellipse", title: "DIRECCIÓN", value: t.direccion ?? "No registrada", color: .systemRed))
            infoStack.addArrangedSubview(createInfoRow(icon: "envelope.fill", title: "CORREO ELECTRÓNICO", value: t.email ?? "No registrado", color: .systemRed))
            
            infoStack.addArrangedSubview(createInfoSectionTitle("DATOS LABORALES"))
            infoStack.addArrangedSubview(createInfoRow(icon: "calendar", title: "FECHA DE INGRESO", value: formatDate(t.fechaIngreso), color: .systemBlue))
            infoStack.addArrangedSubview(createInfoRow(icon: "person.2.fill", title: "JEFE DIRECTO", value: t.jefeNombre ?? "Sin jefe asignado", color: .systemPurple))
            
            infoStack.addArrangedSubview(createInfoSectionTitle("HORARIO Y JORNADA"))
            let entrada = t.horaIngreso ?? "--:--"
            let salida = t.horaSalida ?? "--:--"
            infoStack.addArrangedSubview(createInfoRow(icon: "clock.fill", title: "TURNO", value: "\(entrada) - \(salida)", color: .systemOrange))

            infoStack.addArrangedSubview(createInfoSectionTitle("MODALIDAD DE TRABAJO"))
            infoStack.addArrangedSubview(createInfoRow(icon: "briefcase.fill", title: "MODALIDAD", value: t.modalidadNombre ?? "No definida", color: .systemIndigo))
            if let dp = t.diasPresencial, !dp.isEmpty { infoStack.addArrangedSubview(createInfoRow(icon: "calendar.badge.clock", title: "DÍAS EN OFICINA", value: dp, color: .systemGreen)) }
            if let dr = t.diasRemotos, !dr.isEmpty { infoStack.addArrangedSubview(createInfoRow(icon: "house.fill", title: "DÍAS REMOTOS", value: dr, color: .systemTeal)) }
            
            infoStack.addArrangedSubview(createInfoSectionTitle("ESTADO"))
            infoStack.addArrangedSubview(createInfoRow(icon: "bolt.fill", title: "ESTADO ACTUAL", value: t.activo == true ? "ACTIVO" : "INACTIVO", color: t.activo == true ? .systemGreen : .systemRed))
        }
    }
    
    private func formatDate(_ date: Date?) -> String {
        guard let date = date else { return "No registrada" }
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.locale = Locale(identifier: "es_PE")
        return formatter.string(from: date)
    }

    private func createInfoSectionTitle(_ title: String) -> UIView {
        let l = UILabel()
        l.text = title
        l.font = .systemFont(ofSize: 11, weight: .black)
        l.textColor = .secondaryLabel
        let v = UIView()
        v.addSubview(l)
        l.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            l.topAnchor.constraint(equalTo: v.topAnchor, constant: 15),
            l.leadingAnchor.constraint(equalTo: v.leadingAnchor),
            l.trailingAnchor.constraint(equalTo: v.trailingAnchor),
            l.bottomAnchor.constraint(equalTo: v.bottomAnchor, constant: -5)
        ])
        return v
    }
    
    private func loadAvatar() {
        guard let id = trabajadorId, let url = SupabaseService.shared.getProfileImageUrl(usuarioId: id) else { return }
        URLSession.shared.dataTask(with: url) { [weak self] data, _, _ in
            if let data = data, let image = UIImage(data: data) {
                DispatchQueue.main.async { self?.avatarImageView.image = image }
            }
        }.resume()
    }

    @objc private func changePhotoTapped() {
        let picker = UIImagePickerController()
        picker.delegate = self
        picker.sourceType = .photoLibrary
        present(picker, animated: true)
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        if let image = info[.originalImage] as? UIImage {
            avatarImageView.image = image
            if let id = trabajadorId { SupabaseService.shared.uploadProfileImage(usuarioId: id, image: image) { _ in } }
        }
        picker.dismiss(animated: true)
    }
    @objc private func closeTapped() { dismiss(animated: true) }
}
