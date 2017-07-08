import { StarkAuthPage } from './app.po';

describe('stark-auth App', () => {
  let page: StarkAuthPage;

  beforeEach(() => {
    page = new StarkAuthPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
