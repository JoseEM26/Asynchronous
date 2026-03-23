//
//  PromedioViewController.swift
//  PromedioApp
//
//  Created by XCODE on 21/03/26.
//

import UIKit

class PromedioViewController: UIViewController {

    
    @IBOutlet weak var txtNombre: UITextField!
    @IBOutlet weak var txtNota1: UITextField!
    @IBOutlet weak var txtNota2: UITextField!
    @IBOutlet weak var lblResultado: UILabel!
    
    @IBOutlet weak var txtNota3: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setupdxafter loading the view.
    }
    
    
    
   
    
    @IBAction func btnCalcularPromedio(_ sender: UIButton) {
        
        let nombreIngresado = txtNombre.text?.trimmingCharacters(in: .whitespacesAndNewlines)
        let nombre=(nombreIngresado?.isEmpty==false) ? nombreIngresado! : "Estudiante"
        
        if let nota1Texto = txtNota1.text,
           let nota2Texto=txtNota2.text,
           let nota3Texto=txtNota3.text,
           let nota1 = Double(nota1Texto),
           let nota2 = Double(nota2Texto),
           let nota3 = Double(nota3Texto){
            
            let ponderado1=nota1 * 0.20
            let ponderado2=nota2 * 0.35
            let ponderado3=nota3 * 0.45
            let ponderadoTotal=ponderado1 + ponderado2 + ponderado3
            
            if ponderadoTotal >= 13 {
                
                lblResultado.text="\(nombre) , tu promedio es \(ponderadoTotal ) y aprobaste"
                
            }else{
                
                lblResultado.text="\(nombre) , tu promedio es \(String(format:"%.2f",ponderadoTotal)) y jalaste"

            }
            
        }else{
            
            lblResultado.text = "Ingrese notas validad en formato numerico"
            
        }

        
    }
    

}
