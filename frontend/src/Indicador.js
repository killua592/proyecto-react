import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Indicador() {
    // Estados para manejar los datos y la paginación
    const [indica, setIndicador] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [pageLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [showChart, setShowChart] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    
    // useEffect para obtener los datos al montar el componente
    useEffect(() => {
        axios.get('http://localhost:8081/')
            .then(res => {
                setIndicador(res.data); // Guarda los datos obtenidos
                setFilteredData(res.data); // Inicializa los datos filtrados con todos los datos
            })
            .catch(err => console.log(err)); // Manejo de errores
    }, []);

    // useEffect para filtrar los datos cuando cambian el término de búsqueda o el rango de fechas
    useEffect(() => {
        let filtered = indica.filter(indicador =>
            indicador.nombreIndicador.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Filtrado por rango de fechas
        if (desde && hasta) {
            filtered = filtered.filter(indicador => {
                const fecha = new Date(indicador.fechaIndicador);
                return fecha >= new Date(desde) && fecha <= new Date(hasta);
            });
        }
        
        setFilteredData(filtered);
    }, [searchTerm, indica, desde, hasta]);

    // Cálculo de la paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Función para cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
    const endPage = Math.min(startPage + pageLimit - 1, totalPages);
    
    // Creación del array de páginas
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    //Función para eliminar por ID
    const handleDelete = async (id) => {
        try{
            await axios.delete('http://localhost:8081/delete/'+id)
            window.location.reload()
        }catch(err){
            console.log(err);
        }
    }
    return (
        <div className='d-flex flex-column vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-4 shadow'>
                {/* Encabezado y botón para mostrar/ocultar gráfico */}
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <h2 className="text-primary">Mantenedor Indicador Financiero</h2>
                    <button className='btn btn-info' onClick={() => setShowChart(!showChart)}>
                        {showChart ? 'Ocultar Gráfico' : 'Ver Gráfico'}
                    </button>
                </div>
                
                {/* Barra de búsqueda y botón de agregar */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Link to="/create" className='btn btn-success px-4 py-2 fw-bold'>Agregar +</Link>
                    <input 
                        type="text" 
                        className="form-control w-50" 
                        placeholder="Buscar por nombre..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Filtros de fechas si el gráfico está visible */}
                {showChart && (
                    <div className="d-flex mb-3">
                        <input 
                            type="date" 
                            className="form-control me-2" 
                            value={desde} 
                            onChange={(e) => setDesde(e.target.value)} 
                        />
                        <input 
                            type="date" 
                            className="form-control" 
                            value={hasta} 
                            onChange={(e) => setHasta(e.target.value)} 
                        />
                    </div>
                )}
                
                {/* Tabla de datos o gráfico según el estado de showChart */}
                {!showChart ? (
                    <>
                        <table className='table table-bordered text-center'>
                            <thead className="bg-dark text-white">
                                <tr>
                                    <th>Nombre del indicador</th>
                                    <th>Código del indicador</th>
                                    <th>Unidad de medida</th>
                                    <th>Valor del indicador</th>
                                    <th>Fecha de registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((data, i) => (
                                    <tr key={i}>                                
                                        <td>{data.nombreIndicador}</td>
                                        <td>{data.codigoIndicador}</td>
                                        <td>{data.unidadMedidaIndicador}</td>
                                        <td>{data.valorIndicador}</td>
                                        <td>{data.fechaIndicador}</td>
                                        <td>
                                            <Link to={`update/${data.id}`} className='btn btn-primary me-2'>Modificar</Link>                                        
                                            <button className='btn btn-danger' onClick={ e => handleDelete(data.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Paginación */}
                        {totalPages > 1 && (
                            <nav>
                                <ul className="pagination justify-content-center">
                                    {currentPage > 1 && (
                                        <li className="page-item">
                                            <button onClick={() => paginate(currentPage - 1)} className="page-link">&laquo;</button>
                                        </li>
                                    )}
                                    {pageNumbers.map(number => (
                                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                            <button onClick={() => paginate(number)} className="page-link">{number}</button>
                                        </li>
                                    ))}
                                    {currentPage < totalPages && (
                                        <li className="page-item">
                                            <button onClick={() => paginate(currentPage + 1)} className="page-link">&raquo;</button>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        )}
                    </>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fechaIndicador" />
                            <YAxis />
                            <Tooltip formatter={(value, name, props) => [`${value}`, `Indicador: ${props.payload.nombreIndicador}`]} />
                            <Legend />
                            <Bar dataKey="valorIndicador" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

export default Indicador;
