import UIKit

class DashboardViewController: UIViewController {

    @IBOutlet weak var greetingLabel: UILabel!
    @IBOutlet weak var profileButton: UIButton!
    @IBOutlet weak var scannerButton: UIButton!
    @IBOutlet weak var historyButton: UIButton!
    @IBOutlet weak var logoutButton: UIButton!

    var trabajadorId: Int?

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(true, animated: false)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupActions()
        
        // Estilo ViajesApp
        view.backgroundColor = UIColor(red: 0.96, green: 0.97, blue: 0.94, alpha: 1.0)
        
        let buttons = [profileButton, scannerButton, historyButton, logoutButton]
        for button in buttons {
            button?.layer.cornerRadius = 24
            button?.backgroundColor = .white
            button?.layer.shadowColor = UIColor.black.cgColor
            button?.layer.shadowOpacity = 0.12
            button?.layer.shadowOffset = CGSize(width: 0, height: 10)
            button?.layer.shadowRadius = 14
        }
    }

    private func setupActions() {
        profileButton.addTarget(self, action: #selector(profilePressed), for: .touchUpInside)
    }

    @objc private func profilePressed() {
        performSegue(withIdentifier: "toProfile", sender: trabajadorId)
    }

    @IBAction func logoutPressed(_ sender: UIButton) {
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
        navigationController?.popViewController(animated: true)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toProfile",
           let profileVC = segue.destination as? ProfileViewController,
           let id = sender as? Int {
            profileVC.trabajadorId = id
        }
    }
}
