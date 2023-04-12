import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { CategoryService } from '../../services/category.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit, OnDestroy {
  $obs: Subscription | undefined
  pennding: boolean = false
  loading: boolean = false

  _id: any = undefined

  name = new FormGroup({
    ru: new FormControl(undefined, [Validators.required, Validators.minLength(2)]),
    en: new FormControl(undefined),
    md: new FormControl(undefined)
  })


  hide = false

  constructor(
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.findCategory()
  }

  ngOnDestroy(): void {
    if (this.$obs) {
      this.$obs.unsubscribe()
    }
  }

  findCategory() {
    this._id = this.route.snapshot.queryParamMap.get('_id');

    if (this._id) {
      this.pennding = true
      
      this.categoryService.getById(this._id).subscribe(
        (data) => {
          if (data) {
            this.unZip(data)
            this.pennding = false
          } else {
            this.router.navigate(['/categories'])
          }
        },
        error => {
          this._snackBar.open(
            error.error.message ? error.error.message : "Ошибка"
            , "Ок", 
          {duration: 3000, horizontalPosition: "right"})
          this.router.navigate(['/categories'])
        }
      )
    }

   
  }


  create() {
    this.pennding = true

    this.categoryService.create(this.Zip()).subscribe(
      (data) => {
      
        this._snackBar.open(data.message, "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        
        this.router.navigate(
          ['/category'],
          {
            queryParams: {
              _id: data.category._id
            }
          }
        )

        this.unZip(data.category)

        this.pennding = false

      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.pennding = false
      }
    )
  }


  patch() {
    this.pennding = true
    
    this.categoryService.patch(this.Zip(), this._id).subscribe(
      (data) => {
        this._snackBar.open(data.message, "Ок", 
        {duration: 3000, horizontalPosition: "right"})

        this.unZip(data.category)

        this.pennding = false
      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.pennding = false
      }
    )

  }

  delete() {
    this.pennding = true

    this.categoryService.delete(this._id).subscribe(
      (data) => {
        this._snackBar.open(data.message, "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.router.navigate(['/categories'])
      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок", 
        {duration: 3000, horizontalPosition: "right"})
        this.pennding = false
      }
    )
  }


  unZip(data: any) {
    if (data._id) {
      this._id = data._id
    }

    this.name.setValue({ru: data.name.ru, en: data.name.en, md: data.name.md})
    this.hide = data.hide

  }

  Zip() {
    
    const data = {
      name: this.name.value,
      hide: this.hide,
    }

    return data
  }


}

