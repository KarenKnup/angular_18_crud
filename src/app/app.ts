import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('angular_18_crud');

  employeeForm: FormGroup = new FormGroup({});
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];
  
  isEditMode = false; // 👈 controla se estamos editando


  constructor(){
    this.createForm();
    debugger;
    const oldData = localStorage.getItem('EmpData');
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  reset(){
    //Limpa o formulário e reseta o objeto
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }

  createForm(){
    this.employeeForm = new FormGroup({
      // Define form controls here
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name, [Validators.required]),
      city: new FormControl(this.employeeObj.city),
      state: new FormControl(this.employeeObj.state),
      emailId: new FormControl(this.employeeObj.emailId),
      contactNo: new FormControl(this.employeeObj.contactNo),
      address: new FormControl(this.employeeObj.address),
      pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6)])
    });
  }

  onSave(){
    debugger;
    this.isEditMode = false;
    const oldData = localStorage.getItem('EmpData');
    if(oldData != null){
      const parseData = JSON.parse(oldData);
      this.employeeForm.controls['empId'].setValue(parseData.length + 1);
      this.employeeList.unshift(this.employeeForm.value);
    } else {
      this.employeeList.unshift(this.employeeForm.value);      
    }
    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    this.reset();
  }

  onEdit(item: EmployeeModel){
    this.isEditMode = true;
    this.employeeObj = item;
    this.createForm();
  }

  onUpdate(){
    this.isEditMode = false;
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value);
    if(record != undefined){
      record.name = this.employeeForm.controls['name'].value;
      record.city = this.employeeForm.controls['city'].value;
      record.state = this.employeeForm.controls['state'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.address = this.employeeForm.controls['address'].value;
      record.pinCode = this.employeeForm.controls['pinCode'].value;
    }
    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    this.reset();
  }

  onDelete(id: number){
    const isDelete = confirm('Are you sure to delete this record?');
    if(isDelete){
      const index = this.employeeList.findIndex(m => m.empId == id);
      this.employeeList.splice(index, 1);
      localStorage.setItem('EmpData', JSON.stringify(this.employeeList)); 
    } 
  }

}
