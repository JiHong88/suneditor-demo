/**
 * @generated 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
 * 원본: src/data/snippets/plugin-guide--html-structures/*.snippet.*
 * 생성: node scripts/generate-framework-snippets.cjs
 */

export const HTML_BROWSER = `<!-- Browser Standard Structure -->
<div class="se-browser sun-editor-common">
  <div class="se-browser-back"></div>
  <div class="se-browser-inner">
    <div class="se-browser-content">

      <div class="se-browser-header">
        <button type="button" data-command="close"
          class="se-btn se-browser-close">
          \${icons.cancel}
        </button>
        <span class="se-browser-title">Title</span>
      </div>

      <div class="se-browser-wrapper">
        <div class="se-browser-side"><!-- Folder tree --></div>
        <div class="se-browser-main">
          <div class="se-browser-bar">
            <div class="se-browser-search">
              <form class="se-browser-search-form">
                <input type="text" class="se-input-form"
                  placeholder="Search" />
                <button type="submit" class="se-btn">
                  \${icons.search}
                </button>
              </form>
            </div>
          </div>
          <div class="se-browser-body">
            <div class="se-browser-list">
              <div class="se-file-item-column">
                <div class="se-file-item-img">
                  <img src="..." alt="..."
                    data-command="src_url"
                    data-name="name" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>`;

export const HTML_CONTROLLER = `<!-- Controller Standard Structure -->
<div class="se-controller se-controller-\${kind}">
  <div class="se-arrow se-arrow-up"></div>
  <div class="se-btn-group">
    <button type="button" data-command="edit"
      tabindex="-1" class="se-btn se-tooltip">
      \${icons.edit}
      <span class="se-tooltip-inner">
        <span class="se-tooltip-text">Edit</span>
      </span>
    </button>
    <button type="button" data-command="delete"
      tabindex="-1" class="se-btn se-tooltip">
      \${icons.delete}
      <span class="se-tooltip-inner">
        <span class="se-tooltip-text">Delete</span>
      </span>
    </button>
  </div>
</div>`;

export const HTML_DROPDOWN = `<!-- Dropdown Standard Structure -->
<div class="se-dropdown se-list-layer">
  <div class="se-list-inner">
    <ul class="se-list-basic">
      <li>
        <button type="button"
          class="se-btn se-btn-list"
          data-command="value">
          <span class="se-list-icon">\${icons.icon_key}</span>
          Label
        </button>
      </li>
    </ul>
  </div>
</div>`;

export const HTML_MODAL = `<!-- Modal Standard Structure -->
<div class="se-modal-content">
  <form>
    <div class="se-modal-header">
      <button type="button" data-command="close"
        class="se-btn se-close-btn" aria-label="Close">
        \${icons.cancel}
      </button>
      <span class="se-modal-title">Title</span>
    </div>

    <div class="se-modal-body">
      <div class="se-modal-form">
        <label>Label</label>
        <input class="se-input-form" type="text" data-focus />
      </div>
      <div class="se-modal-form">
        <label>Select</label>
        <select class="se-input-select">...</select>
      </div>
    </div>

    <div class="se-modal-footer">
      <button type="submit" class="se-btn-primary">
        <span>Submit</span>
      </button>
    </div>
  </form>
</div>`;

export const HTML_POPUP = `<!-- Popup (Controller-based) Structure — Pattern: anchor -->
<div class="se-controller se-controller-\${kind}">
  <div class="se-arrow se-arrow-up"></div>
  <div class="link-content">
    <div class="se-controller-display">
      <!-- Display content (e.g., id, label) -->
    </div>
    <div class="se-btn-group">
      <button type="button" data-command="edit"
        tabindex="-1" class="se-btn se-tooltip">
        \${icons.edit}
        <span class="se-tooltip-inner">
          <span class="se-tooltip-text">Edit</span>
        </span>
      </button>
      <button type="button" data-command="delete"
        tabindex="-1" class="se-btn se-tooltip">
        \${icons.delete}
        <span class="se-tooltip-inner">
          <span class="se-tooltip-text">Delete</span>
        </span>
      </button>
    </div>
  </div>
</div>

<!-- Input Form variant (anchor plugin) -->
<div class="se-controller se-controller-simple-input">
  <div class="se-arrow se-arrow-up"></div>
  <form>
    <div class="se-controller-display">Label</div>
    <div class="se-btn-group se-form-group">
      <input type="text" required />
      <button type="submit" data-command="submit"
        class="se-btn se-btn-success">
        \${icons.checked}
      </button>
      <button type="button" data-command="cancel"
        class="se-btn se-btn-danger">
        \${icons.cancel}
      </button>
    </div>
  </form>
</div>`;
