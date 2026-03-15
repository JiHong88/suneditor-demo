import { PluginBrowser } from 'suneditor/src/interfaces';
import Browser from 'suneditor/src/modules/contract/Browser';

class MyBrowser extends PluginBrowser {
  static key = 'myBrowser';

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    this.title = 'My Browser';
    this.icon = 'image';

    this.browser = new Browser(this, this.$, {
      title: 'Browse Items',
      data: [],                // Static data array, or use url: '...' for server fetch
      columnSize: 4,           // Items per row
      useSearch: true,         // Enable search bar
      selectorHandler: this.#onSelect.bind(this), // Item click handler
      drawItemHandler: (item) => {
        // Return HTML string for each item cell
        // data-command attribute is required for Browser's click handler
        return '<div class="se-file-item-img" data-command="...">...</div>';
      },
    });
  }

  // ── [Required] ──────────────────────────────────────
  /** Opens the browser/gallery panel.
   *  @param {Function} onSelectfunction — Callback passed by the editor to handle selected items. */
  open(onSelectfunction) {
    this.onSelectfunction = onSelectfunction;
    this.browser.open();
  }

  /** Closes the browser/gallery panel. */
  close() {
    this.browser.close();
  }

  // ── [Optional] ──────────────────────────────────────
  /** Called when the browser initializes or closes. */
  // browserInit() {}

  #onSelect(target) {
    // Handle the selected item
    // this.$.html.insert('...');
    // this.$.history.push(false);
  }
}
