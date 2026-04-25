import UIKit

// Modelo simple para representar un destino dentro de la coleccion.
struct Destino {
    let nombre: String
    let pais: String
    let precio: String
    let nombreImagen: String
    let colorFondo: UIColor

    // Datos de ejemplo para que la app funcione desde la primera ejecucion.
    static let ejemplos: [Destino] = [
        Destino(nombre: "Cusco", pais: "Peru", precio: "Desde S/ 420", nombreImagen: "cusco", colorFondo: UIColor(red: 0.96, green: 0.69, blue: 0.42, alpha: 1.0)),
        Destino(nombre: "Cartagena", pais: "Colombia", precio: "Desde S/ 680", nombreImagen: "cartagena", colorFondo: UIColor(red: 0.36, green: 0.74, blue: 0.89, alpha: 1.0)),
        Destino(nombre: "Cancun", pais: "Mexico", precio: "Desde S/ 920", nombreImagen: "cancun", colorFondo: UIColor(red: 0.31, green: 0.80, blue: 0.73, alpha: 1.0)),
        Destino(nombre: "Mancora", pais: "Peru", precio: "Desde S/ 390", nombreImagen: "mancora", colorFondo: UIColor(red: 0.99, green: 0.77, blue: 0.35, alpha: 1.0)),
        Destino(nombre: "Bariloche", pais: "Argentina", precio: "Desde S/ 1,050", nombreImagen: "bariloche", colorFondo: UIColor(red: 0.58, green: 0.69, blue: 0.93, alpha: 1.0)),
        Destino(nombre: "Rio", pais: "Brasil", precio: "Desde S/ 860", nombreImagen: "rio", colorFondo: UIColor(red: 0.96, green: 0.49, blue: 0.57, alpha: 1.0))
    ]
}
