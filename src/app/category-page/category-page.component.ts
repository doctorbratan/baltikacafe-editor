import { Component, OnDestroy, OnInit } from '@angular/core';

import { CategoryService } from '../services/category.service';

import { MatSnackBar } from '@angular/material/snack-bar';

export interface Category {
  _id: string | any,
  name: 
  {
    ru: string | any,
    en: string | any,
    md: string | any
  }
}

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit, OnDestroy {

  pennding: boolean = false
  change: boolean = false

  categories: any[] | undefined

  constructor(
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getCategories()
  }

  ngOnDestroy(): void {
  }

  changePosition(arr: any[], old_order: number, new_order: number) {
    this.change = true

    if (new_order >= arr.length) {
      var k = new_order - arr.length + 1;
      while (k--) {
          arr.push(undefined);
      }
    }

    arr.splice(new_order, 0, arr.splice(old_order, 1)[0]);


  }

  saveOrder(arr: any[] | undefined) {
    this.pennding = true

    if (Array.isArray(arr)) {
      const data = []

      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        data.push({ _id: element._id, order: index + 1 })
      }

      this.categoryService.changeOrder(data).subscribe(
        (data) => {
          this.getCategories();
          this.change = false
          this._snackBar.open(data, "Ок",
            { duration: 3000, horizontalPosition: "right" })
        },
        (error) => {
          console.warn(error)
        }
      )
      
    }

  }

  getCategories() {
    this.pennding = true

    this.categoryService.getAll().subscribe(
      (data: any[]) => {
        this.pennding = false
        this.categories = data
      },
      (error) => {
        console.warn(error)
      }
    )
  }

}
