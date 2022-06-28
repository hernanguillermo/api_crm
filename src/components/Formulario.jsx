import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import Alerta from './Alerta'
import Spinner from '../components/Spinner'

const Formulario = ({cliente, cargando}) => {
    const navigate = useNavigate()
    const nuevoClienteSchema = yup.object().shape({
        nombre: yup.string().min(3, 'El Nombre es muy corto').max(20, 'El Nombre es muy largo').required('El Nombre del Cliente es Obligatorio'),
        empresa: yup.string().required('El Nombre de la empresa es obligatorio'),
        email: yup.string().email('Email no válido').required('El Email es obligatorio'),
        telefono: yup.number().positive('Número no válido').integer('Número no válido').typeError('El número no es válido'),
    })
    const handleSubmit = async (valores) => {
        let respuesta
        try {
            if(cliente.id) {
                const url = `http://localhost:4000/clientes/${cliente.id}`
                respuesta = await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(valores),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            } else {
                const url = 'http://localhost:4000/clientes'
                respuesta = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(valores),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
            await respuesta.json()
            navigate('/clientes')
        } catch (error) {
            console.log(error)

        }
    }
    return (
        cargando ? <Spinner /> : (
            <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
                <h1 className='text-gray-600 font-bold text-xl uppercase text-center'>{cliente?.nombre ? 'Editar Cliente' : 'Agregar Cliente'}</h1>
                <Formik initialValues={{nombre: cliente?.nombre ?? '', empresa: cliente?.empresa ?? '', email: cliente?.email ?? '', telefono: cliente?.telefono ?? '', notas: cliente?.notas ?? ''}} enableReinitialize={true} validationSchema={nuevoClienteSchema} onSubmit={ async (values, {resetForm}) => {
                    await handleSubmit(values)
                    resetForm()
                }}>
                    {() => (
                        <Form className='mt-10'>
                            <div className="mb-4">
                                <label htmlFor="nombre" className='text-gray-800'>Nombre:</label>
                                <Field id="nombre" type="text" className="mt-2 block w-full p-3 bg-gray-50" placeholder="Nombre del Cliente" name="nombre" />
                                <ErrorMessage name="nombre">{msg => <Alerta>{msg}</Alerta>}</ErrorMessage>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="empresa" className='text-gray-800'>Empresa:</label>
                                <Field id="empresa" type="text" className="mt-2 block w-full p-3 bg-gray-50" placeholder="Empresa del Cliente" name="empresa" />
                                <ErrorMessage name="empresa">{msg => <Alerta>{msg}</Alerta>}</ErrorMessage>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className='text-gray-800'>Email:</label>
                                <Field id="email" type="email" className="mt-2 block w-full p-3 bg-gray-50" placeholder="Email del Cliente" name="email" />
                                <ErrorMessage name="email">{msg => <Alerta>{msg}</Alerta>}</ErrorMessage>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="telefono" className='text-gray-800'>Telefono:</label>
                                <Field id="telefono" type="tel" className="mt-2 block w-full p-3 bg-gray-50" placeholder="Telefono del Cliente" name="telefono" />
                                <ErrorMessage name="telefono">{msg => <Alerta>{msg}</Alerta>}</ErrorMessage>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="notas" className='text-gray-800'>Notas:</label>
                                <Field as="textarea" id="notas" type="text" className="mt-2 block w-full p-3 bg-gray-50 h-40" placeholder="Notas del Cliente" name="notas" />
                            </div>
                            <input type="submit" value={cliente?.nombre ? 'Actualizar Cliente' : 'Agregar Cliente'} className='mt-5 w-full bg-blue-800 p-3 text-white upeercase font-bold text-lg' />
                        </Form>
                    )}
                </Formik>
            </div>
        )
    )
}

Formulario.defaultProps = {
    cliente: {},
    cargando: false
}
export default Formulario