import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPostsComponent } from './public-posts.component';

describe('PublicPostsComponent', () => {
  let component: PublicPostsComponent;
  let fixture: ComponentFixture<PublicPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
