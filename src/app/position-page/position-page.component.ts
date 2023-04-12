import { Component, OnInit, OnDestroy} from '@angular/core';


import { CategoryService } from '../services/category.service';
import { PositionService } from "../services/position.service";

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-position-page',
  templateUrl: './position-page.component.html',
  styleUrls: ['./position-page.component.css']
})
export class PositionPageComponent implements OnInit {

  loading: boolean = false
  change: boolean = false

  categories: any[] | undefined
  selected_category: any

  positions: any[] | undefined

  
  constructor(
    private categoryService: CategoryService,
    private positionService: PositionService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.findCategories()
  }

  addQueryParams(data: any) {

    if (data.category) {

      this.router.navigate([], {
        queryParams: {
          category: data.category
        }
      })

    }

  }

  paramsCategory() {
    const candidate = this.route.snapshot.queryParamMap.get('category');

    if (candidate) {
      this.selected_category = candidate
      this.getPositions();
    } else {
      if (this.categories) {
        this.selected_category = this.categories[0]._id
        this.getPositions();
      } 
    }

  }


  findCategories() {
    this.loading = true


    this.categoryService.getAll().subscribe(
      (data: any[]) => {

        this.categories = data.map( category => {
          return {
            _id: category._id,
            name: category.name.ru
          }
        })

        this.paramsCategory();
        this.loading = false
      },
      error => {
        this._snackBar.open(
        error.error.message ? error.error.message : "Ошибка", "Ок",
        { duration: 3000, horizontalPosition: "right" })
      }
    )
  }



  getPositions() {
    this.loading = true
    this.positions = undefined

    this.positionService.getByCategory(this.selected_category).subscribe(
      (data: any[]) => {
        this.positions =  data
        this.loading = false
      },
      error => {
        this._snackBar.open(
        error.error.message ? error.error.message : "Ошибка", "Ок",
        { duration: 3000, horizontalPosition: "right" })
      }
    )
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
    this.loading = true

    if (Array.isArray(arr)) {
      const data = []

      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        data.push({ _id: element._id, order: index + 1 })
      }

      this.positionService.changeOrder(data).subscribe(
        (data) => {
          this.getPositions();
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

}
