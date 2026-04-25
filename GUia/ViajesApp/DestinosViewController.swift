import UIKit

class DestinosViewController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {

    @IBOutlet weak var lblSubtitulo: UILabel!
    @IBOutlet weak var collectionDestinos: UICollectionView!

    // Datos que alimentan la coleccion visual.
    private let destinos = Destino.ejemplos

    override func viewDidLoad() {
        super.viewDidLoad()

        title = "Destinos"
        view.backgroundColor = UIColor(red: 0.96, green: 0.97, blue: 0.94, alpha: 1.0)
        lblSubtitulo.text = "Explora ideas para tu proximo viaje y compara precios base."

        // La coleccion trabajara con este controlador como fuente de datos y delegado.
        collectionDestinos.dataSource = self
        collectionDestinos.delegate = self
        collectionDestinos.contentInset = UIEdgeInsets(top: 4, left: 0, bottom: 20, right: 0)
        collectionDestinos.backgroundColor = .clear
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        // Ajustamos el tamano de las celdas segun el ancho disponible.
        guard let layout = collectionDestinos.collectionViewLayout as? UICollectionViewFlowLayout else { return }

        let anchoDisponible = collectionDestinos.bounds.width
        let columnas: CGFloat = traitCollection.horizontalSizeClass == .compact ? 2 : 3
        let espacioTotal = layout.minimumInteritemSpacing * (columnas - 1)
        let anchoCelda = (anchoDisponible - espacioTotal) / columnas
        layout.itemSize = CGSize(width: anchoCelda, height: anchoCelda * 1.22)
    }

    // MARK: - UICollectionViewDataSource

    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        destinos.count
    }

    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "DestinoCell", for: indexPath) as! DestinoCollectionViewCell
        let destino = destinos[indexPath.item]
        cell.configurar(con: destino)
        return cell
    }

    // MARK: - UICollectionViewDelegate

    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let destino = destinos[indexPath.item]

        // Mensaje breve para reforzar la seleccion de una celda.
        let alerta = UIAlertController(
            title: destino.nombre,
            message: "\(destino.pais)\n\(destino.precio)\nIdeal para trabajar celdas y eventos en CollectionView.",
            preferredStyle: .alert
        )
        alerta.addAction(UIAlertAction(title: "Cerrar", style: .default))
        present(alerta, animated: true)
    }

    // MARK: - UICollectionViewDelegateFlowLayout

    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        18
    }

    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, minimumInteritemSpacingForSectionAt section: Int) -> CGFloat {
        14
    }
}
