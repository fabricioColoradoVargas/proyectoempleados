import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function App() {
  const [empleadosList, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("0");
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [correo, setCorreo] = useState("");
  const [id, setIde] = useState('');
  const [editar, setEditar] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre,
      edad,
      pais,
      cargo,
      correo
    }).then(() => {
      getEmpleados();
      limpiarCampo();
      MySwal.fire("¡Registrado exitoso!", "El empleado fue registrado", "success");
    });
  };

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id,
      nombre,
      edad,
      pais,
      cargo,
      correo
    }).then(() => {
      getEmpleados();
      MySwal.fire("¡Actualizado correctamente!", "El empleado se actualizó", "success");
    });
  };

  const deleteEmple = (id, nombre) => {
    Swal.fire({
      title: "¿Eliminar?",
      text: `¿Desea eliminar a ${nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
          if (busqueda === "") {
            // Si la búsqueda está vacía, recargamos toda la lista
            getEmpleados();
          } else {
            // Si hay búsqueda, actualizamos la lista filtrada
            buscarEmpleado(busqueda);
          }
          limpiarCampo();
          Swal.fire("Eliminado", `${nombre} ha sido eliminado.`, "success");
        });
      }
    });
  };

  const limpiarCampo = () => {
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setCorreo("");
    setIde("");
    setEditar(false);
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setCorreo(val.correo);
    setIde(val.id);
  };

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data);
    });
  };

  const buscarEmpleado = (valor) => {
    setBusqueda(valor);
    if (valor === "") {
      // Si el valor está vacío, recargamos toda la lista de empleados
      getEmpleados();
    } else {
      // Si hay un valor en la búsqueda, hacemos la búsqueda filtrada
      Axios.get(`http://localhost:3001/buscar?termino=${valor}`).then((response) => {
        setEmpleados(response.data);
      });
    }
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  return (
    <div className="container">
      <div className="App">

        {/* Formulario */}
        <div className="card text-center mb-4">
          <div className="card-header">Registro de empleados</div>
          <div className="card-body">

            <div className="input-group mb-3">
              <span className="input-group-text">Nombre:</span>
              <input type="text" onChange={(e) => setNombre(e.target.value)} value={nombre} className="form-control" />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">Edad:</span>
              <input type="number" onChange={(e) => setEdad(e.target.value)} value={edad} className="form-control" />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">País:</span>
              <input type="text" onChange={(e) => setPais(e.target.value)} value={pais} className="form-control" />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">Cargo:</span>
              <input type="text" onChange={(e) => setCargo(e.target.value)} value={cargo} className="form-control" />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">Correo:</span>
              <input type="email" onChange={(e) => setCorreo(e.target.value)} value={correo} className="form-control" />
            </div>

          </div>
          <div className="card-footer">
            {
              editar ? (
                <>
                  <button className="btn btn-danger m-2" onClick={update}>Actualizar</button>
                  <button className="btn btn-info m-2" onClick={limpiarCampo}>Cancelar</button>
                </>
              ) : (
                <button className="btn btn-success" onClick={add}>Registrar</button>
              )
            }
          </div>
        </div>

        {/* Campo de búsqueda justo antes de la tabla */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">Buscar:</span>
            <input
              type="text"
              onChange={(event) => buscarEmpleado(event.target.value)}
              className="form-control"
              placeholder="Buscar por nombre, edad, país, cargo o correo"
              value={busqueda}
            />
          </div>
        </div>

        {/* Tabla */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>País</th>
              <th>Cargo</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosList.map((val) => (
              <tr key={val.id}>
                <td>{val.id}</td>
                <td>{val.nombre}</td>
                <td>{val.edad}</td>
                <td>{val.pais}</td>
                <td>{val.cargo}</td>
                <td>{val.correo}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-info" onClick={() => editarEmpleado(val)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => deleteEmple(val.id, val.nombre)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default App;
