import * as nodemailer from 'nodemailer';



export async function sendMail(msg:string){

    const transporter = nodemailer.createTransport({
        host: 'goiascontabil.com',
        port: 465,
        auth: {
            user: 'suporte.thunnar@goiascontabil.com',
            pass: 'n7%&a$bq7OdQg',
        },
        
    });

    console.log(transporter);

    transporter.sendMail({
        from: 'suporte.thunnar@goiascontabil.com',
        to:'rmvnew@gmail.com',
        subject:'Teste de email',
        html:`<h1>${msg}</h1>`

    }).then(()=>{
        console.log('Success!!');
    }).catch(error =>{
        console.log('Error: ',error );
    })
    
}