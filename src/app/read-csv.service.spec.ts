import { TestBed } from '@angular/core/testing';

import { ReadCSVService } from './read-csv.service';

describe('ReadCSVService', () => {
  let service: ReadCSVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadCSVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
