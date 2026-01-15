# ProyectoBancoHorizon



## Requisitos para funcionamiento del proyecto.
- `npm install`
- `npm install typescript ts-node @types/node --save-dev`
- `npm install express mongoose`
- `npm install @types/express --save-dev`
- `npm install -g @angular/cli`
- `npm install @angular/common @angular/core @angular/http`
- `npm install moment`
- `npm install googleapis` -> es del back
- `npm i --save-dev @types/nodemailer` -> es del back
- Instalar MongoDB y Postman.


## Funcionamiento para observar datos de la base de datos (MongoDB | Postman)
1. Enviar IP Publica para ser aceptado en la base de datos. La puedes encontrar en el siguiente link `https://www.whatismyip.com/`.
2. Se debe tener instalado como previo requisito MongoDB y Postman.
3. Abrir postman y colocra el siguiente URL: `http://localhost:4000/api`
4. Seleccionar el método GET y darle a enviar.
![Peticion GET en Postman](/img_readme/usoPostman.png)
5. Para realizar la conexión en MongoDB se debera crear una nueva conexion  y pegar el URL que se encuentra en **"Usuario.services.ts"**
![Visualizacion en MongoDB](/img_readme/ConexionMongoDB.png)

## Funcionamiento de Servidore 
1. Abrir un terminar, ingresar a la carpeta `Base_Datos_API_REST` y colocar el comando `npm start` esto para ejecutar la base de datos.
![Iniciar Base de Datos](/img_readme/IniciarBaseDatos.png)
2. Abrir otro terminar, ingresar a la carpeta `banco-app` y ejecutar el comando `ng serve`
![Iniciar Proyecto](/img_readme/IniciarProyecto.png)

