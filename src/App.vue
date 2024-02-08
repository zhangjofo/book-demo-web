<template>
  <div style="width: 94%; margin: 0 auto;">
    <div style="float: left;width: 70%; height: 50px;">
      <el-input v-model="bookQueryDTO.title" placeholder="Book Title" style="width:200px" clearable></el-input>
      <el-input v-model="bookQueryDTO.isbn" placeholder="ISBN" style="margin-left:10px;width:200px" clearable></el-input>
      <el-input v-model="bookQueryDTO.author" placeholder="Author" style="margin-left:10px;width:200px"
        clearable></el-input>
      <el-button type="primary" icon="el-icon-search" style="margin-left:10px" @click="initData">search</el-button>
    </div>
    <el-button icon="el-icon-plus" type="primary" style="float: right;" @click="createOperation">create</el-button>
    <el-table :data="list" border>
      <el-table-column prop="title" label="Book Title" />
      <el-table-column prop="isbn" label="ISBN" width="150" />
      <el-table-column prop="author" label="Author" width="200" />
      <el-table-column prop="publicationYear" label="Publication Year" width="150" />
      <el-table-column prop="createdTime" label="Created Time" width="180" />
      <el-table-column prop="updateTime" label="Update Time" width="180" />
      <el-table-column prop="bookStatusName" label="Status" width="150" />
      <el-table-column fixed="right" label="Operation" width="200">
        <template slot-scope="scope">
          <el-button @click="editOperation(scope.row)" type="primary" icon="el-icon-edit" size="small">Edit</el-button>
          <el-button @click="deleteOperation(scope.row)" type="danger" icon="el-icon-delete"
            size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;">
      <el-pagination background :page-size="pageSize" 
      :current-page="pageNumber" @current-change="handlePageClick"
      :page-count="totalPages"
      layout="prev, pager, next"
        :total="total">
    </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="bookDTO" label-width="150px">
        <el-form-item label="Book Title">
          <el-input v-model="bookDTO.title"></el-input>
        </el-form-item>
        <el-form-item label="Author">
          <el-input v-model="bookDTO.author"></el-input>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="bookDTO.isbn" style="width:220px"></el-input><el-link :underline="false" type="danger" style="margin-left:10px;">Unique key</el-link>
        </el-form-item>
        <el-form-item label="Publication Year" label-width="150px">
          <div class="block">
            <el-date-picker v-model="bookDTO.publicationYear" type="year" value-format="yyyy" placeholder="Choose year">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="Status" v-if="bookDTO.id !== ''">
          <el-select v-model="bookDTO.bookStatus" placeholder="Please select">
            <el-option v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveOperation">Submit</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listData,bookStatusData, addData, getData, updateData, deleteData } from './service/api'
export default {
  data() {
    return {
      bookQueryDTO: {
        pageNumber: 1,
        pageSize: 10,
        title: "",
        author: "",
        isbn: "",
        sortBy: "createdTime",
        sortDirection: "DESC"
      },
      list: [],
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      totalPages:1,
      dialogVisible: false,
      bookDTO: {
        title: "",
        author: "",
        isbn: "",
        publicationYear: "",
        bookStatus:1,
        bookStatusName: ""
      },
      dialogTitle: "Create Book",
      options:[]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      listData(this.bookQueryDTO).then((res) => {
        this.list = res.data.content
        this.total = res.data.totalElements
        this.pageNumber = res.data.number + 1
        this.totalPages = res.data.totalPages
        this.pageSize = res.data.size
      })
    },
    createOperation() {
      this.options = []
      bookStatusData().then((res) => {
         for(let key in res){
          this.options.push({value:key,label:res[key]})
         }
      })
      this.bookDTO = {
        id: "",
        title: "",
        author: "",
        isbn: "",
        publicationYear: "",
        bookStatus: "",
        bookStatusName:""
      }
      this.dialogTitle = "Create Book"
      this.dialogVisible = true
    },
    saveOperation() {
      if (this.bookDTO.id !== undefined && this.bookDTO.id !== '') {
        updateData(this.bookDTO).then((res) => {
          console.log(res)
          if(res.code===10200) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.initData()
            this.dialogVisible = false
          }else{
            this.$message.error(res.message)
          }
        })
      } else {
        addData(this.bookDTO).then((res) => {
          console.log(res)
          if(res.code===10200) {
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.initData()
            this.dialogVisible = false
          }else{
            this.$message.error(res.message)
          }
        })
      }
    },
    editOperation(row) {
      this.options = []
      bookStatusData().then((res) => {
         for(let key in res.data){
          this.options.push({value:key,label:res.data[key]})
         }
      })
      getData(row.id).then((res) => {
        this.bookDTO = res.data
        this.bookDTO.publicationYear = this.bookDTO.publicationYear + ''
        this.bookDTO.bookStatus = res.data.bookStatus + ''
        this.dialogTitle = "Edit Book"
        this.dialogVisible = true
      })
    },
    deleteOperation(row) {
      this.$confirm('This will permanently delete the record, Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteData(row.id).then((res) => {
          this.$message({
            message: res.message,
            type: 'success'
          });
          this.initData()
        })
      })
    },
    handlePageClick(row){
      this.bookQueryDTO.pageNumber = row
      this.initData()
    },
  }
}
</script>
