import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { SlidesListComponent } from './slides-list.component';
import { SlidesSearchComponent } from './slides-search/slides-search.component';
import { SlidesCardComponent } from './slides-card/slides-card.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {SlidesService} from '../../services/index';
import {HttpModule} from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NotifBarService} from 'app/core';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

@Injectable()
class SlidesServiceMock {
    getSlideToSearch(textToSearch): Observable<any> {
        const params: URLSearchParams = new URLSearchParams();
        params.set('title', textToSearch.title);
        params.set('state', textToSearch.filter);
        params.set('favorite', textToSearch.favorite);
        return Observable.of(
            [{'slidesSetting': {
                'title': 'new slides',
                'description': '',
                'tags': [],
                'public': true,
                'favorite': false,
                'author': 'cherifa_ghersi'
            }, 'slides': [{
                'pageTitle': {'align': '', 'title': 'chart'},
                'hasText': false,
                'hasGraph': true,
                'config': {
                    'chartType': {
                        'title': 'Number Cards',
                        'name': 'number-cards',
                    }
                },
                'textVerAlign': 'TOP',
                'text': '',
                'index': 4}]
            }
            ]);
    };
    getSlidesList(): Observable<any> {
        return Observable.of([
            {'slidesSetting': {
                'title': 'new slides',
                'description': '',
                'tags': [],
                'public': true,
                'favorite': false,
                'author': 'cherifa_ghersi'
            }, 'slides': [{
                'pageTitle': {'align': '', 'title': 'chart'},
                'hasText': false,
                'hasGraph': true,
                'config': {
                    'chartType': {
                        'title': 'Number Cards',
                        'name': 'number-cards',
                    }
                },
                'textVerAlign': 'TOP',
                'text': '',
                'index': 4}]
            },
            {'slidesSetting': {
                'title': 'prez',
                'description': '',
                'tags': [],
                'public': true,
                'favorite': false,
                'author': 'cherifa_ghersi'
            }, 'slides': [{
                'pageTitle': {'align': '', 'title': 'chart'},
                'hasText': false,
                'hasGraph': true,
                'config': {
                    'chartType': {
                        'title': 'Number Cards',
                        'name': 'number-cards',
                    }
                },
                'textVerAlign': 'TOP',
                'text': '',
                'index': 4}]
            }
        ])
    }
}
describe('SlidesListComponent', () => {
    let component: SlidesListComponent;
    let fixture: ComponentFixture<SlidesListComponent>;
    let slidesServiceMock: SlidesServiceMock;
    let de: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                FormsModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                HttpModule
            ],
            declarations: [ SlidesListComponent, SlidesSearchComponent, SlidesCardComponent ],
            providers : [{provide : SlidesService, useClass : SlidesServiceMock}, NotifBarService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlidesListComponent);
        component = fixture.componentInstance;
        slidesServiceMock =  new SlidesServiceMock();
        de = fixture.debugElement.query(By.css('.slides-title'));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have response with 1 slide when user search for a slide ', () => {
        const textTosearch = {
            title: 'new',
            state: 'All',
            favorite: 'All'
        };
        let length = 0;
        slidesServiceMock.getSlideToSearch(textTosearch).subscribe(resp => {
           length = resp.length;
        });
        expect(length).toBe(1);
    });

    it('should have response with 2 slides at all  ', () => {
        let length = 0;
        slidesServiceMock.getSlidesList().subscribe(resp => {
            length = resp.length;
        });
        expect(length).toBe(2);
    });
    it('should have title on slides ', () => {
        const textTosearch = {
            title: 'new',
            state: 'All',
            favorite: 'All'
        };
        let title = '';
        slidesServiceMock.getSlideToSearch(textTosearch).subscribe(resp => {
            title  = resp[0].slidesSetting.title;
        });
        expect(title).toBe('new slides');
    });
    it('should title contain the search text', () => {
        const textTosearch = {
            title: 'new',
            state: 'All',
            favorite: 'All'
        };
        let title = '';
        slidesServiceMock.getSlideToSearch(textTosearch).subscribe(resp => {
            title  = resp[0].slidesSetting.title;
        });
        expect(title).toContain(textTosearch.title);
    });

});
