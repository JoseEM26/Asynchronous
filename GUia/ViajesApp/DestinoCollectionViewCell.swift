import UIKit

class DestinoCollectionViewCell: UICollectionViewCell {

    @IBOutlet weak var vistaTarjeta: UIView!
    @IBOutlet weak var imgDestino: UIImageView!
    @IBOutlet weak var lblNombre: UILabel!
    @IBOutlet weak var lblPais: UILabel!
    @IBOutlet weak var lblPrecio: UILabel!

    override func awakeFromNib() {
        super.awakeFromNib()

        // Configuracion visual base de la tarjeta.
        vistaTarjeta.layer.cornerRadius = 26
        vistaTarjeta.layer.masksToBounds = false
        vistaTarjeta.layer.shadowColor = UIColor.black.cgColor
        vistaTarjeta.layer.shadowOpacity = 0.12
        vistaTarjeta.layer.shadowOffset = CGSize(width: 0, height: 10)
        vistaTarjeta.layer.shadowRadius = 14
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        vistaTarjeta.layer.shadowPath = UIBezierPath(roundedRect: vistaTarjeta.bounds, cornerRadius: vistaTarjeta.layer.cornerRadius).cgPath
    }

    // Carga los datos del destino dentro de la celda.
    func configurar(con destino: Destino) {
        vistaTarjeta.backgroundColor = destino.colorFondo
        imgDestino.image = UIImage(named: destino.nombreImagen)
        imgDestino.contentMode = .scaleAspectFill
        imgDestino.clipsToBounds = true
        imgDestino.layer.cornerRadius = 18
        lblNombre.text = destino.nombre
        lblPais.text = destino.pais
        lblPrecio.text = destino.precio
    }
}
