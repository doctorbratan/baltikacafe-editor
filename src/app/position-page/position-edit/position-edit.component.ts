import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { PositionService } from "../../services/position.service";

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';

export interface Positon {

  _id?: string | any,

  category: string,

  Image: any
  ImageUpload: any

  name:
  {
    ru: string | any,
    en: string | any,
    md: string | undefined
  },
  description: {
    ru: string | undefined,
    en: string | undefined,
    md: string | undefined
  },
  value: {
    ru: string | undefined,
    en: string | undefined,
    md: string | undefined
  },

  cost: number | undefined,

  option_required: boolean,
  options:
  [
    {
      name: {
        ru: string,
        en: string,
        md: string
      },
      cost: number
    }
  ],

  hide: boolean
}

@Component({
  selector: 'app-position-edit',
  templateUrl: './position-edit.component.html',
  styleUrls: ['./position-edit.component.css']
})
export class PositionEditComponent implements OnInit {
  @ViewChild('image') imageRef!: ElementRef

  pennding: boolean = false
  loading: boolean = false

  /*  */
  _id: string | undefined

  category: string | undefined

  Image: any
  ImageUpload: any

  name = new FormGroup({
    ru: new FormControl(undefined, [Validators.required, Validators.minLength(1)]),
    en: new FormControl(undefined),
    md: new FormControl(undefined)
  })


  description: any = {
    ru: undefined,
    en: undefined,
    md: undefined
  }

  value: any = {
    ru: undefined,
    en: undefined,
    md: undefined
  }

  option_required: boolean = false
  options: any[] = []

  cost: number | undefined

  hide: boolean = false
  /*  */

  constructor(
    private positionService: PositionService,
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    let category = this.isNew()
    let _id = this.hasId()

    if (this._id) {
      this.findById()
    } else if (category) {
      this.category = category
      this.checkCategory(category);
    } else if (_id) {
      this._id = _id
      this.findById()
    } else {
      this.router.navigate(['/positions'])
    }

  }

  checkCategory(_id: string) {
    this.categoryService.getById(_id).subscribe(
      data => {
        if (!data) {
          this.router.navigate(['/positions'])
        }
      },
      error => {
        this.router.navigate(['/positions'])
      }
    )
  }

  isNew() {

    const category = this.route.snapshot.queryParamMap.get('category');

    if (category) {
      return category
    } else {
      return false
    }

  }

  hasId() {
    const _id = this.route.snapshot.queryParamMap.get('_id');

    if (_id) {
      return _id
    } else {
      return false
    }
  }

  findById() {
    this.pennding = true

    this.positionService.getById(this._id!).subscribe(
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
          { duration: 3000, horizontalPosition: "right" })
        this.pennding = false
      }
    )
  }

  addOption() {
    const option =
    {
      name: {
        ru: undefined,
        en: undefined,
        md: undefined
      },
      cost: undefined
    }

    this.options.push(option)
  }

  deleteOption(i: number) {
    this.options.splice(i, 1)
  }

  changePosition(arr: any[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }

    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

  }

  create() {
    this.pennding = true


    this.positionService.create(this.Zip()).subscribe(
      (data) => {

        this._snackBar.open(data.message, "Ок",
          { duration: 3000, horizontalPosition: "right" })

        this.router.navigate(
          ['/position'],
          {
            queryParams: {
              _id: data.position._id
            }
          }
        )

        this.unZip(data.position)

        this.pennding = false

      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок",
          { duration: 3000, horizontalPosition: "right" })
        this.pennding = false
      }
    )
  }

  triggerImageClick() {
    this.imageRef.nativeElement.click()
  }
  
  onImageUpload(event: any) {
    if (event) {
      const file = event.target.files[0]
      this.ImageUpload = file
  
      const reader = new FileReader()
  
      reader.onload = () => {
        this.Image = reader.result
      }
  
      reader.readAsDataURL(file)
    }
  }


  patch() {
    this.pennding = true


    this.positionService.patch(this.Zip(), this._id!).subscribe(
      (data) => {
        this._snackBar.open(data.message, "Ок",
          { duration: 3000, horizontalPosition: "right" })

        this.unZip(data.position)

        this.pennding = false

      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок",
          { duration: 3000, horizontalPosition: "right" })
        this.pennding = false
      }
    )

  }

  delete() {
    this.pennding = true

    this.positionService.delete(this._id!).subscribe(
      (data) => {

        this._snackBar.open(data, "Ок",
          { duration: 3000, horizontalPosition: "right" })

        this.router.navigate(['/positions'], {
          queryParams: {
            category: this.category
          }
        })
      },
      error => {
        this._snackBar.open(
          error.error.message ? error.error.message : "Ошибка"
          , "Ок",
          { duration: 3000, horizontalPosition: "right" })
        this.pennding = false
      }
    )
  }

  unZip(data: any) {

    if (data._id) {
      this._id = data._id
    }

    this.category = data.category

    this.name.setValue({ ru: data.name.ru, en: data.name.en, md: data.name.md })

    if (data.description) {
      this.description = data.description
    }

    if (data.value) {
      this.value = data.value
    }

    if (data.cost) {
      this.cost = data.cost
    }

    this.option_required = data.option_required
    this.options = data.options

    this.hide = data.hide

    this.ImageUpload = undefined
    if (data.image) {
      setTimeout(() => {
        this.Image = data.image
      }, 1000);
    }

  }

  Zip() {

    const data = {
      category: this.category,
      name: this.name.value,
      description: this.description,
      value: this.value,
      cost: this.cost,
      hide: this.hide,
      option_required: this.option_required,
      options: this.options,
      imageUpload: this.ImageUpload ? this.ImageUpload : undefined
    }

    return data
  }

}
