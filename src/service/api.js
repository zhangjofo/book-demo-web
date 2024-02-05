import fetch from './fetch'

export const listData = (bookQueryDTO) => fetch('book/list', bookQueryDTO, 'POST')

export const addData = (bookDTO) => fetch('book/add', bookDTO, 'POST')

export const getData = (id) => fetch('book/get/'+id, {}, 'GET')

export const updateData = (bookEditDTO) => fetch('book/update', bookEditDTO, 'PUT')

export const deleteData = (id) => fetch('book/delete/'+id, {}, 'DELETE')

export const bookStatusData = () => fetch('book/bookStatus', '', 'GET')