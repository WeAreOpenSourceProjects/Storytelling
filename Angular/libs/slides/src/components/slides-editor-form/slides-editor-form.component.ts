import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { PresentationsApiService } from '@labdat/presentations-state';
import { ValidService } from '../../services/valid.service';
import { Presentation } from '@labdat/data-models';
import { SlidesEditorComponent } from './slides-editor/slides-editor.component';
//import { NotifBarService } from 'app/core';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-slides-editor-form',
  templateUrl: './slides-editor-form.component.html',
  styleUrls: ['./slides-editor-form.component.scss'],
  providers: [PresentationsApiService, ValidService]
})
export class SlidesEditorFormComponent implements OnInit, AfterViewChecked {
  private id: string; //slides id in database
  private slider: Presentation = new Presentation(); //corresponding slides
  private editorValid: Subscription; //validation of slide editor
  private errorMsg; //error
  private mode = ''; //SAVE mode or CREATE mode
  private isRequired = false;
  private isInShuffle = false;
  loading = true;
  private currentSlides$ = this.store.select(selectCurrentSlide);
  @ViewChild('editor') _editor: SlidesEditorComponent;

  constructor(
    private router: Router,
    private presentationsApiService: PresentationsApiService,
    private validService: ValidService,
    private route: ActivatedRoute,
    //        private notifBarService: NotifBarService,
    private cdRef: ChangeDetectorRef
  ) {
    this.id = null;
    this.slider = new Presentation();
    this.errorMsg = [];
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
    if (this.id) {
      this.mode = 'SAVE';
      this.presentationsApiService.findOneById(this.id).subscribe(
        slides => {
          this.slider = slides;
        },
        error => {
          //                    this.notifBarService.showNotif('fail to load slides users-list. error is ' + error);
        },
        () => (this.loading = false)
      );
    } else {
      this.mode = 'CREATE';
      this.slider = new Presentation();
      this.loading = false;
    }
  }

  // TODO rework service, rename in presentatiion
  errorsHandle(currentSlide) {
    if (currentSlide.isValid) {
      this.errorMsg = [];
      this.slider.slides.forEach(
        (slide, index) =>
          !slide.isValid
            ? this.errorMsg.push({ msg: 'Slide ' + (index + 1) + ' is not finished', index: index + 1 })
            : false
      );
    }
  }

  saveSlides(id) {
    if (id) {
      this.presentationsApiService.update({ id: this.slider, changes: this.slider._id }).subscribe(
        () => {
          //                    this.notifBarService.showNotif('your changes in slides has been saved.');
          this.router.navigate(['/slides']);
        }
        //                error => this.notifBarService.showNotif('fail to save your changes. the error is ' + error)
      );
    } else {
      this.slider = this._editor.slider;
      this.presentationsApiService.add(this.slider).subscribe(
        () => {
          //                    this.notifBarService.showNotif('create slides successfully!');
          this.router.navigate(['/slides']);
        },
        error => {
          //                    this.notifBarService.showNotif('fail to create slides. the error is ' + error);
        }
      );
    }
  }
  slideDeleted(index) {
    this.errorMsg.forEach((arrayMsg, i) => {
      if (arrayMsg.index === index) {
        this.errorMsg.splice(i, 1);
      }
    });
  }

  onShuffle(shuffle) {
    this.isInShuffle = shuffle;
    if (!shuffle) {
      this.errorMsg = [];
    }
  }
}
