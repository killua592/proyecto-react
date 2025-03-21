import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateIndicador() {
    const [formData, setFormData] = useState({
        nombreIndicador: '',
        codigoIndicador: '',
        unidadMedidaIndicador: '',
        valorIndicador: '',
        fechaIndicador: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Limpiar errores cuando el usuario escribe
        setErrors({ ...errors, [id]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};

        // 🔹 Validaciones antes de enviar datos
        if (!formData.nombreIndicador.trim()) {
            validationErrors.nombreIndicador = 'El nombre del indicador es obligatorio.';
        }
        if (!formData.codigoIndicador.trim()) {
            validationErrors.codigoIndicador = 'El código del indicador es obligatorio.';
        }
        if (!formData.unidadMedidaIndicador.trim()) {
            validationErrors.unidadMedidaIndicador = 'La unidad de medida es obligatoria.';
        }
        if (formData.valorIndicador === '' || isNaN(formData.valorIndicador) || Number(formData.valorIndicador) < 0) {
            validationErrors.valorIndicador = 'Ingrese un valor válido (no negativo).';
        }
        if (!formData.fechaIndicador) {
            validationErrors.fechaIndicador = 'Seleccione una fecha.';
        }

        // 🔹 Si hay errores, detener el envío
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // 🔹 Enviar los datos al backend
            const response = await axios.post('http://localhost:8081/create', formData);
            console.log('Respuesta del servidor:', response.data);
            alert('Indicador guardado exitosamente.');

            // 🔹 Redirigir a la página principal después de guardar
            navigate('/');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Hubo un error al guardar. Inténtalo nuevamente.');
        }
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded shadow p-4'>
                <h2 className="text-center mb-4 text-primary">Agregar Indicador Financiero</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="nombreIndicador" className="form-label fw-bold text-start d-block">
                            Nombre del Indicador
                        </label>
                        <input
                            type='text'
                            placeholder='Ingrese Nombre'
                            className={`form-control ${errors.nombreIndicador ? 'is-invalid' : ''}`}
                            id="nombreIndicador"
                            value={formData.nombreIndicador}
                            onChange={handleChange}
                        />
                        {errors.nombreIndicador && <div className="text-danger">{errors.nombreIndicador}</div>}

                        <label htmlFor="codigoIndicador" className="form-label fw-bold text-start d-block mt-2">
                            Código del Indicador
                        </label>
                        <input
                            type='text'
                            placeholder='Ingrese Código'
                            className={`form-control ${errors.codigoIndicador ? 'is-invalid' : ''}`}
                            id="codigoIndicador"
                            value={formData.codigoIndicador}
                            onChange={handleChange}
                        />
                        {errors.codigoIndicador && <div className="text-danger">{errors.codigoIndicador}</div>}

                        <label htmlFor="unidadMedidaIndicador" className="form-label fw-bold text-start d-block mt-2">
                            Unidad de Medida
                        </label>
                        <input
                            type='text'
                            placeholder='Ingrese unidad de medida'
                            className={`form-control ${errors.unidadMedidaIndicador ? 'is-invalid' : ''}`}
                            id="unidadMedidaIndicador"
                            value={formData.unidadMedidaIndicador}
                            onChange={handleChange}
                        />
                        {errors.unidadMedidaIndicador && <div className="text-danger">{errors.unidadMedidaIndicador}</div>}

                        <label htmlFor="valorIndicador" className="form-label fw-bold text-start d-block mt-2">
                            Valor del Indicador
                        </label>
                        <input
                            type='number'
                            placeholder='Ingrese valor'
                            className={`form-control ${errors.valorIndicador ? 'is-invalid' : ''}`}
                            id="valorIndicador"
                            value={formData.valorIndicador}
                            onChange={handleChange}
                        />
                        {errors.valorIndicador && <div className="text-danger">{errors.valorIndicador}</div>}

                        <label htmlFor="fechaIndicador" className="form-label fw-bold text-start d-block mt-2">
                            Fecha registro
                        </label>
                        <input
                            type='date'
                            className={`form-control ${errors.fechaIndicador ? 'is-invalid' : ''}`}
                            id="fechaIndicador"
                            value={formData.fechaIndicador}
                            onChange={handleChange}
                        />
                        {errors.fechaIndicador && <div className="text-danger">{errors.fechaIndicador}</div>}
                    </div>

                    <div className='d-flex justify-content-between mt-4'>
                        <button type="submit" className="btn btn-success px-4">Guardar</button>
                        <Link to="/" className="btn btn-danger px-4">Cancelar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateIndicador;
