import {
  Keypair,
  Horizon,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
  Memo
} from '@stellar/stellar-sdk';


const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = Networks.TESTNET;

const SECRET_KEY = 'SBZEGUJKR6BQEGV33GZEVWUV5EDOXLQ4E5MFR3WTMUO2P3SLGEKRRHCA'; // Tu secret key
//const DESTINATION = 'GCI52VI5QTMVAGRKOGE7U42KVDM63LKAUBG3V7G3UQU5ZMK4FSWNWKQO'; // Cuenta destino

async function enviarPago(amount, memo = '', DESTINATION) {
  try {
    console.log('🚀 Iniciando pago...\n');
    
    // Paso 1: Cargar tu cuenta
    const sourceKeys = Keypair.fromSecret(SECRET_KEY);
    const sourceAccount = await server.loadAccount(sourceKeys.publicKey());
    
    console.log(`Balance actual: ${sourceAccount.balances[0].balance} XLM\n`);
    
    // Paso 2: Construir transacción
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: networkPassphrase
    })
      .addOperation(Operation.payment({
        destination: DESTINATION,
        asset: Asset.native(),
        amount: amount.toString()
      }))
      .addMemo(memo ? Memo.text(memo) : Memo.none())
      .setTimeout(30)
      .build();
    
    // Paso 3: Firmar
    transaction.sign(sourceKeys);
    
    // Paso 4: Enviar
    const result = await server.submitTransaction(transaction);
    
    console.log('🎉 ¡PAGO EXITOSO!\n');
    console.log(`💰 Enviaste: ${amount} XLM`);
    console.log(`🔗 Hash: ${result.hash}\n`);
    
    return result;
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    throw error;
  }
}
const destinatarios = [
    { publicKey: "GCI52VI5QTMVAGRKOGE7U42KVDM63LKAUBG3V7G3UQU5ZMK4FSWNWKQO", memo: "Pago-001" },
    { publicKey: "GC4KZEJQ6PJURXCSGBOXYPU4XUFEJ6D7HRKRBQ452N7KEPLKAKYBZYWE", memo: "Pago-002" },
    { publicKey: "GCI52VI5QTMVAGRKOGE7U42KVDM63LKAUBG3V7G3UQU5ZMK4FSWNWKQO", memo: "Pago-003" }
];

for (let i = 0; i <= 2; i++) {
    console.log(`Enviando pago ${i+1}...`);
    // Tu código aquí
    
    //await para que espere a que se complete el pago antes de continuar con el siguiente
    await enviarPago('2', destinatarios[i].memo, destinatarios[i].publicKey);

    
    
}
//enviarPago('25', '¡Liz pago!');