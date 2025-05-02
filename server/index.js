  const express = require("express");
  const app = express();
  const mysql = require("mysql")
  const cors = require("cors")

  app.use(cors());
  app.use(express.json());

  const db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "empleados"
  });

  app.post("/create", (req, res)=> {
      const nombre = req.body.nombre;
      const edad = req.body.edad;
      const pais = req.body.pais;
      const cargo = req.body.cargo;
      const correo = req.body.correo;

      db.query('INSERT INTO empleados(nombre,edad,pais,cargo,correo) VALUES(?,?,?,?,?)', [nombre, edad, pais, cargo, correo],
          (err,result) => {
              if (err) {
                  console.log(err);

              }else{
                  res.send("Empleado registrado con exito");
              }
          }
      )
  });
  app.get("/empleados", (req, res)=> {
      db.query('SELECT* FROM empleados',
        (err, result)=> {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        }
      );
    });
  app.put("/update", (req, res) => {
      const { id, nombre, edad, pais, cargo, correo } = req.body;
      db.query(
        "UPDATE empleados SET nombre = ?, edad = ?, pais = ?, cargo = ?, correo = ? WHERE id = ?",
        [nombre, edad, pais, cargo, correo, id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error al actualizar el empleado");
          } else {
            res.send("Empleado actualizado con éxito");
          }
        }
      );
    });
    
  app.listen(3001, ()=> {
      console.log("corriendo el puerto 3001")
  })
  app.delete("/delete/:id" , (req, res) =>{
      const id = req.params.id;
      db.query('DELETE from empleados where id = ?', id, 
          (err,result) =>{
              if(err){
                  console.log(err);
              }else{
                  res.send(result);
              }
          }
      )
  });
  app.get("/buscar", (req, res) => {
    const termino = req.query.termino;

    if (!termino) {
        return res.status(400).send("Falta el parámetro de búsqueda");
    }

    const query = `
        SELECT * FROM empleados 
        WHERE nombre LIKE ? 
        OR CAST(edad AS CHAR) LIKE ? 
        OR pais LIKE ? 
        OR cargo LIKE ? 
        OR correo LIKE ?`;

    const valor = `%${termino}%`;

    db.query(query, [valor, valor, valor, valor, valor], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al buscar empleados");
        } else {
            res.send(result);
        }
    });
  });
