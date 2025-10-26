import { Keypair } from '@stellar/stellar-sdk';

async function crearCuenta() {
  console.log('🔐 Generando tu nuevo par de llaves...\n');
  
  // Generar llaves aleatorias
  const pair = Keypair.random();

  //Keypair.random() (del SDK de Stellar) genera una nueva pareja de claves aleatoria
  //pair.publicKey() (la pública) y pair.secret() (la privada/seed).
  
  console.log('✅ ¡Cuenta creada!\n');
  console.log('📧 PUBLIC KEY (puedes compartir):');
  console.log(pair.publicKey());
  console.log('\n🔑 SECRET KEY (NUNCA COMPARTIR):');
  console.log(pair.secret());
  
  // Fondear con Friendbot
  console.log('\n💰 Fondeando con Friendbot...');
  
  try {

    //await promesa, es un objeto que representa algo que va a pasar en el futuro.
    // puede tener tres estados: pendiente, cumplida o rechazada 
    //                           (en inglés: pending, fulfilled, rejected)

    const response = await fetch( //await espera a que la promesa se resuelva
      `https://friendbot.stellar.org/?addr=${pair.publicKey()}`
    );
    
    const result = await response.json(); //await porque espera que lo parsees a JSON
    

    //result.successful  verifica que el parseo fue exitoso
    //response.ok  verifica que la respuesta HTTP fue exitosa (código 200-299)
    if (result.successful || response.ok) {
      console.log('✅ ¡Cuenta fondeada con 10,000 XLM!\n');
      console.log('🔗 Transaction hash:', result.hash);

      // devolver un objeto con la info
      return {
        publicKey: pair.publicKey(),
        secretKey: pair.secret(),
        hash: result.hash
      };

    }

  } catch (error) {
    console.error('❌ Error al fondear:', error.message);
  }
  
  console.log('\n⚠️  IMPORTANTE: Guarda estas llaves en un lugar seguro\n');
}

const vector = [];// array donde voy a guardar las cuentas

// Ejemplo de estructura del bucle
for (let i = 1; i <= 5; i++) {
    console.log(`Creando cuenta ${i}...`);
    // Tu código aquí
     
    //vector.push(crearCuenta()); esto guarda el resultado de la promesa, no lo que genera la función
    
    vector.push(await crearCuenta()); //esto guarda el resultado de la función después de que la promesa se resuelve
    //crearCuenta();
}

console.log('-------------------imprimiendo vector de cuentas creadas -------------------');  

for (let i = 1; i <= 5; i++) {
    console.log(`cuenta ${i}`);

    console.log(vector[i-1]); //imprimo el objeto que está en la posición i-1 del array 
                              //recordar que las posiciones empiezan en 0
}