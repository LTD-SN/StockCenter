const LS_KEY = "stock_distribuidora_data_v1";
const CFG_KEY = "stock_distribuidora_cfg_v1";
const META_KEY = "stock_distribuidora_meta_v1";
const CONFLICT_BACKUP_KEY = "stock_distribuidora_conflict_backup_v1";
const THEME_KEY = "stock_distribuidora_theme_v1";
const VIEW_KEY = "stock_distribuidora_view_v1";
const PRODUCT_LIST_OPEN_KEY = "stock_distribuidora_product_list_open_v1";
const FIREBASE_DOC_PATH = ["apps", "stock-distribuidora"];

const state = {
  products: [],
  history: [],
  cart: [],
  sales: [],
  debts: [],
  customers: [],
  productVariants: [],
  combos: [],
  promotions: [],
  dashboardCfg: {
    compareDays: 7,
  },
  meta: {
    dirty: false,
    lastSyncAt: "",
    lastBackupDay: "",
    deleted: {
      products: [],
      productVariants: [],
      combos: [],
      promotions: [],
      customers: [],
      debts: [],
      sales: [],
      history: [],
    },
  },
  cfg: {
    globalMargin: "",
    roundingMode: "none",
  },
  filterText: "",
  filterCategory: "",
};

const cloud = {
  enabled: false,
  db: null,
  syncing: false,
  lastError: "",
  firestoreOffline: false,
  remoteUnsub: null,
  remotePending: false,
};

const ui = {
  notifOpen: false,
  lowStockToastShown: false,
  lastPaymentMethod: "efectivo",
  historyOpen: false,
  currentView: "home",
  comboDraftItems: [],
  productListOpen: false,
  /** Lista abierta por decisión del usuario (se guarda en localStorage). */
  catalogListPinnedOpen: false,
  /** Si el usuario cerró la lista con filtro activo, no reabrir hasta que cambie el filtro. */
  catalogListForcedClosed: false,
};

const SYNC_TIMEOUT_MS = 45000;
const SYNC_INTERVAL_MS = 10000;

const $ = (id) => document.getElementById(id);
const dom = {
  syncBtn: $("syncBtn"),
  syncDot: $("syncDot"),
  notifBtn: $("notifBtn"),
  notifBadge: $("notifBadge"),
  notifPanel: $("notifPanel"),
  notifList: $("notifList"),
  notifEmpty: $("notifEmpty"),
  globalMargin: $("globalMargin"),
  roundingMode: $("roundingMode"),
  applyGlobalBtn: $("applyGlobalBtn"),
  bulkIncreaseBtn: $("bulkIncreaseBtn"),
  resetAllDataBtn: $("resetAllDataBtn"),
  searchInput: $("searchInput"),
  categoryFilter: $("categoryFilter"),
  newProductBtn: $("newProductBtn"),
  alerts: $("alerts"),
  productTbody: $("productTbody"),
  mobileCards: $("mobileCards"),
  toggleProductListBtn: $("toggleProductListBtn"),
  productListPanel: $("productListPanel"),
  catalogSearchMeta: $("catalogSearchMeta"),
  quickProduct: $("quickProduct"),
  quickCode: $("quickCode"),
  addByCodeBtn: $("addByCodeBtn"),
  quickQty: $("quickQty"),
  saleProductSearch: $("saleProductSearch"),
  saleQuickPickWrap: $("saleQuickPickWrap"),
  saleQuickPickMeta: $("saleQuickPickMeta"),
  saleQuickPickList: $("saleQuickPickList"),
  addToCartBtn: $("addToCartBtn"),
  clearCartBtn: $("clearCartBtn"),
  cartTbody: $("cartTbody"),
  cartMobileCards: $("cartMobileCards"),
  cartTotal: $("cartTotal"),
  paymentMethod: $("paymentMethod"),
  customerRow: $("customerRow"),
  customerName: $("customerName"),
  fiadoInterestRow: $("fiadoInterestRow"),
  fiadoInterestPct: $("fiadoInterestPct"),
  fiadoPaymentMethodRow: $("fiadoPaymentMethodRow"),
  fiadoPaymentMethod: $("fiadoPaymentMethod"),
  amountPaidLabel: $("amountPaidLabel"),
  amountPaid: $("amountPaid"),
  paymentSummary: $("paymentSummary"),
  checkoutBtn: $("checkoutBtn"),
  moveProduct: $("moveProduct"),
  moveType: $("moveType"),
  moveQty: $("moveQty"),
  registerMoveBtn: $("registerMoveBtn"),
  countProduct: $("countProduct"),
  countQty: $("countQty"),
  applyRecountBtn: $("applyRecountBtn"),
  recountDiff: $("recountDiff"),
  toggleHistoryBtn: $("toggleHistoryBtn"),
  historyPanel: $("historyPanel"),
  historyTbody: $("historyTbody"),
  historyMobileCards: $("historyMobileCards"),
  cashSummary: $("cashSummary"),
  debtsTbody: $("debtsTbody"),
  debtsMobileCards: $("debtsMobileCards"),
  settledDebtsTbody: $("settledDebtsTbody"),
  settledDebtsMobileCards: $("settledDebtsMobileCards"),
  exportCsvBtn: $("exportCsvBtn"),
  dashboardSummary: $("dashboardSummary"),
  dashboardTopProducts: $("dashboardTopProducts"),
  dashboardAlerts: $("dashboardAlerts"),
  customerNameSelect: $("customerNameSelect"),
  customersTbody: $("customersTbody"),
  customersMobileCards: $("customersMobileCards"),
  customerForm: $("customerForm"),
  customerId: $("customerId"),
  customerFullName: $("customerFullName"),
  customerPhone: $("customerPhone"),
  customerLimit: $("customerLimit"),
  customerNotes: $("customerNotes"),
  variantForm: $("variantForm"),
  variantProduct: $("variantProduct"),
  variantSku: $("variantSku"),
  variantColor: $("variantColor"),
  variantSize: $("variantSize"),
  variantUnit: $("variantUnit"),
  variantStock: $("variantStock"),
  variantCost: $("variantCost"),
  variantPrice: $("variantPrice"),
  variantCode: $("variantCode"),
  variantsTbody: $("variantsTbody"),
  variantsMobileCards: $("variantsMobileCards"),
  comboForm: $("comboForm"),
  comboName: $("comboName"),
  comboProductSelect: $("comboProductSelect"),
  comboProductQty: $("comboProductQty"),
  addComboItemBtn: $("addComboItemBtn"),
  comboItemsList: $("comboItemsList"),
  comboDiscountPct: $("comboDiscountPct"),
  comboFixedPrice: $("comboFixedPrice"),
  comboStartAt: $("comboStartAt"),
  comboEndAt: $("comboEndAt"),
  combosTbody: $("combosTbody"),
  combosMobileCards: $("combosMobileCards"),
  promoForm: $("promoForm"),
  promoName: $("promoName"),
  promoProduct: $("promoProduct"),
  promoDiscountPct: $("promoDiscountPct"),
  promotionsTbody: $("promotionsTbody"),
  promotionsMobileCards: $("promotionsMobileCards"),
  productDialog: $("productDialog"),
  productForm: $("productForm"),
  productId: $("productId"),
  dialogTitle: $("dialogTitle"),
  categorySuggestions: $("categorySuggestions"),
  cancelDialogBtn: $("cancelDialogBtn"),
  debtPaymentDialog: $("debtPaymentDialog"),
  debtPaymentForm: $("debtPaymentForm"),
  debtPaymentId: $("debtPaymentId"),
  debtPaymentCustomer: $("debtPaymentCustomer"),
  debtPaymentPending: $("debtPaymentPending"),
  debtPaymentAmount: $("debtPaymentAmount"),
  debtPaymentMethod: $("debtPaymentMethod"),
  cancelDebtPaymentBtn: $("cancelDebtPaymentBtn"),
  debtInterestDialog: $("debtInterestDialog"),
  debtInterestForm: $("debtInterestForm"),
  debtInterestId: $("debtInterestId"),
  debtInterestCustomer: $("debtInterestCustomer"),
  debtInterestPct: $("debtInterestPct"),
  cancelDebtInterestBtn: $("cancelDebtInterestBtn"),
  debtDetailDialog: $("debtDetailDialog"),
  debtDetailContent: $("debtDetailContent"),
  appPromptDialog: $("appPromptDialog"),
  appPromptForm: $("appPromptForm"),
  appPromptTitle: $("appPromptTitle"),
  appPromptMessage: $("appPromptMessage"),
  appPromptInputRow: $("appPromptInputRow"),
  appPromptInputLabel: $("appPromptInputLabel"),
  appPromptInput: $("appPromptInput"),
  appPromptCancelBtn: $("appPromptCancelBtn"),
  appPromptOkBtn: $("appPromptOkBtn"),
  appLoading: $("appLoading"),
  appLoadingText: $("appLoadingText"),
  toast: $("toast"),
  themeSelect: $("themeSelect"),
  appNav: $("appNav"),
};

const navButtons = Array.from(document.querySelectorAll("[data-view-btn]"));
const viewPanels = Array.from(document.querySelectorAll(".view-panel"));

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function roundPrice(value, mode) {
  if (mode === "none") return Number(value.toFixed(2));
  const base = Math.round(value);
  if (mode === "0") return Math.round(base / 10) * 10;
  if (mode === "5") {
    const last = base % 10;
    if (last <= 2) return base - last;
    if (last <= 7) return base - last + 5;
    return base - last + 10;
  }
  return Number(value.toFixed(2));
}

function calcPrice(cost, margin) {
  const raw = cost + cost * (margin / 100);
  return roundPrice(raw, state.cfg.roundingMode);
}

function getGlobalMarginValue() {
  if (state.cfg.globalMargin === "" || state.cfg.globalMargin == null) return 30;
  return toNumber(state.cfg.globalMargin, 30);
}

function effectiveMargin(product) {
  const globalMargin = getGlobalMarginValue();
  if (product.margin == null || product.margin === "") return globalMargin;
  return toNumber(product.margin, globalMargin);
}

function recalcProduct(product) {
  const cost = toNumber(product.cost);
  const margin = effectiveMargin(product);
  product.price = calcPrice(cost, margin);
}

function productDisplayName(product) {
  const brand = (product.brand || "").trim();
  return brand ? `${product.name} - ${brand}` : product.name;
}

function toast(text) {
  dom.toast.textContent = text;
  dom.toast.classList.add("show");
  setTimeout(() => dom.toast.classList.remove("show"), 1600);
}

let loadingDepth = 0;
function setAppLoading(active, message = "Cargando...") {
  if (!dom.appLoading) return;
  if (active) {
    loadingDepth += 1;
    if (dom.appLoadingText) dom.appLoadingText.textContent = message;
    dom.appLoading.classList.remove("hidden");
    return;
  }
  loadingDepth = Math.max(0, loadingDepth - 1);
  if (loadingDepth === 0) dom.appLoading.classList.add("hidden");
}

async function runWithAppLoading(task, message = "Procesando...") {
  setAppLoading(true, message);
  try {
    return await task();
  } finally {
    setAppLoading(false);
  }
}

function openAppPromptDialog({
  title = "Confirmación",
  message = "",
  okText = "Aceptar",
  cancelText = "Cancelar",
  showInput = false,
  inputLabel = "Valor",
  inputPlaceholder = "",
  inputValue = "",
} = {}) {
  return new Promise((resolve) => {
    if (!dom.appPromptDialog || !dom.appPromptForm) {
      resolve({ confirmed: false, value: null });
      return;
    }
    dom.appPromptTitle.textContent = title;
    dom.appPromptMessage.textContent = message;
    dom.appPromptOkBtn.textContent = okText;
    dom.appPromptCancelBtn.textContent = cancelText;
    dom.appPromptInputRow.classList.toggle("hidden", !showInput);
    dom.appPromptInputLabel.textContent = inputLabel;
    dom.appPromptInput.placeholder = inputPlaceholder;
    dom.appPromptInput.value = inputValue;

    let settled = false;
    const closeAndResolve = (payload) => {
      if (settled) return;
      settled = true;
      cleanup();
      try {
        dom.appPromptDialog.close();
      } catch (_) {}
      resolve(payload);
    };
    const onOk = () => {
      closeAndResolve({ confirmed: true, value: showInput ? String(dom.appPromptInput.value ?? "") : null });
    };
    const onCancel = () => closeAndResolve({ confirmed: false, value: null });
    const onNativeCancel = (e) => {
      e.preventDefault();
      onCancel();
    };
    const onClose = () => closeAndResolve({ confirmed: false, value: null });
    const cleanup = () => {
      dom.appPromptOkBtn?.removeEventListener("click", onOk);
      dom.appPromptCancelBtn?.removeEventListener("click", onCancel);
      dom.appPromptDialog.removeEventListener("cancel", onNativeCancel);
      dom.appPromptDialog.removeEventListener("close", onClose);
    };

    dom.appPromptOkBtn?.addEventListener("click", onOk);
    dom.appPromptCancelBtn?.addEventListener("click", onCancel);
    dom.appPromptDialog.addEventListener("cancel", onNativeCancel);
    dom.appPromptDialog.addEventListener("close", onClose);
    dom.appPromptDialog.showModal();
    if (showInput) dom.appPromptInput?.focus();
  });
}

function resolveThemeName(rawTheme) {
  if (rawTheme === "dark") return "dark";
  return "light";
}

function applyTheme(rawTheme) {
  const theme = resolveThemeName(rawTheme);
  document.documentElement.setAttribute("data-theme", theme);
  if (dom.themeSelect) dom.themeSelect.value = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {}
}

function initTheme() {
  let theme = "light";
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      theme = stored;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } catch (_) {}
  applyTheme(theme);
}

function applyCurrentView() {
  const current = ui.currentView || "home";
  viewPanels.forEach((panel) => {
    const panelView = panel.dataset.view || "home";
    panel.classList.toggle("hidden", panelView !== current);
  });
  navButtons.forEach((btn) => {
    const active = btn.dataset.viewBtn === current;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-current", active ? "page" : "false");
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function applyProductListPanel() {
  if (!dom.productListPanel || !dom.toggleProductListBtn) return;
  dom.productListPanel.classList.toggle("hidden", !ui.productListOpen);
  dom.toggleProductListBtn.setAttribute("aria-expanded", String(ui.productListOpen));
  dom.toggleProductListBtn.textContent = ui.productListOpen ? "Ocultar lista de productos" : "Mostrar lista de productos";
}

function syncCatalogProductListVisibilityForFilter() {
  const hasText = String(state.filterText || "").trim().length > 0;
  const hasCategory = Boolean(state.filterCategory);
  const filtering = hasText || hasCategory;
  if (!filtering) {
    ui.catalogListForcedClosed = false;
    ui.productListOpen = ui.catalogListPinnedOpen;
  } else if (!ui.catalogListForcedClosed) {
    ui.productListOpen = true;
  } else {
    ui.productListOpen = false;
  }
  applyProductListPanel();
}

function setCurrentView(view) {
  ui.currentView = view || "home";
  try {
    localStorage.setItem(VIEW_KEY, ui.currentView);
  } catch (_) {}
  applyCurrentView();
}

function updateSyncStatus() {
  if (!dom.syncBtn) return;
  if (dom.syncDot) dom.syncDot.className = "sync-dot sync-gray";
  dom.syncBtn.title = "";
  if (!cloud.enabled) {
    dom.syncBtn.textContent = "Sincronizar";
    return;
  }
  if (!navigator.onLine) {
    dom.syncBtn.textContent = state.meta.dirty ? "Sin conexion (pendiente)" : "Sin conexion";
    if (dom.syncDot) dom.syncDot.className = `sync-dot ${state.meta.dirty ? "sync-red" : "sync-gray"}`;
    return;
  }
  if (cloud.firestoreOffline) {
    dom.syncBtn.textContent = state.meta.dirty ? "Firestore offline (pendiente)" : "Firestore offline";
    if (dom.syncDot) dom.syncDot.className = `sync-dot ${state.meta.dirty ? "sync-red" : "sync-yellow"}`;
    return;
  }
  if (cloud.syncing) {
    dom.syncBtn.textContent = "Sincronizando...";
    if (dom.syncDot) dom.syncDot.className = "sync-dot sync-yellow";
    return;
  }
  if (cloud.lastError) {
    dom.syncBtn.textContent = "Error de sync (reintentar)";
    dom.syncBtn.title = cloud.lastError;
    if (dom.syncDot) dom.syncDot.className = "sync-dot sync-red";
    return;
  }
  dom.syncBtn.textContent = state.meta.dirty ? "Pendiente de sincronizar" : "Sincronizado";
  if (dom.syncDot) dom.syncDot.className = `sync-dot ${state.meta.dirty ? "sync-red" : "sync-green"}`;
}

function saveLocal() {
  localStorage.setItem(
    LS_KEY,
    JSON.stringify({
      products: state.products,
      history: state.history,
      cart: state.cart,
      sales: state.sales,
      debts: state.debts,
      customers: state.customers,
      productVariants: state.productVariants,
      combos: state.combos,
      promotions: state.promotions,
      dashboardCfg: state.dashboardCfg,
    })
  );
  localStorage.setItem(CFG_KEY, JSON.stringify(state.cfg));
  localStorage.setItem(META_KEY, JSON.stringify(state.meta));
}

function resetLocalStorageData() {
  localStorage.removeItem(LS_KEY);
  localStorage.removeItem(CFG_KEY);
  localStorage.removeItem(META_KEY);
}

function resetStateData() {
  state.products = [];
  state.history = [];
  state.cart = [];
  state.sales = [];
  state.debts = [];
  state.customers = [];
  state.productVariants = [];
  state.combos = [];
  state.promotions = [];
  state.dashboardCfg = { compareDays: 7 };
  state.filterText = "";
  state.filterCategory = "";
  state.meta = {
    dirty: false,
    lastSyncAt: "",
    lastBackupDay: "",
    deleted: {
      products: [],
      productVariants: [],
      combos: [],
      promotions: [],
      customers: [],
      debts: [],
      sales: [],
      history: [],
    },
  };
  state.cfg = {
    globalMargin: "",
    roundingMode: "none",
  };
}

async function deleteFirestoreAppData() {
  if (!cloud.enabled || !cloud.db) return null;
  const appsRef = cloud.db.collection(FIREBASE_DOC_PATH[0]);
  const mainDocRef = appsRef.doc(FIREBASE_DOC_PATH[1]);

  const idField = firebase.firestore.FieldPath.documentId();
  const backupsSnap = await appsRef
    .where(idField, ">=", "stock-distribuidora-backup-")
    .where(idField, "<=", "stock-distribuidora-backup-\uf8ff")
    .get();

  if (!backupsSnap.empty) {
    let batch = cloud.db.batch();
    let count = 0;
    for (const docSnap of backupsSnap.docs) {
      batch.delete(docSnap.ref);
      count += 1;
      if (count === 450) {
        await batch.commit();
        batch = cloud.db.batch();
        count = 0;
      }
    }
    if (count > 0) await batch.commit();
  }

  const emptyPayload = buildEmptyServerPayload();
  await mainDocRef.set(sanitizeForFirestore(emptyPayload));
  return emptyPayload;
}

function loadLocal() {
  const rawData = localStorage.getItem(LS_KEY);
  const rawCfg = localStorage.getItem(CFG_KEY);
  const rawMeta = localStorage.getItem(META_KEY);
  if (rawData) {
    const parsed = JSON.parse(rawData);
    state.products = parsed.products || [];
    state.history = parsed.history || [];
    state.cart = parsed.cart || [];
    state.sales = parsed.sales || [];
    state.debts = parsed.debts || [];
    state.customers = parsed.customers || [];
    state.productVariants = parsed.productVariants || [];
    state.combos = parsed.combos || [];
    state.promotions = parsed.promotions || [];
    state.dashboardCfg = { ...state.dashboardCfg, ...(parsed.dashboardCfg || {}) };
  }
  if (rawCfg) {
    state.cfg = {
      ...state.cfg,
      ...JSON.parse(rawCfg),
    };
  }
  if (rawMeta) {
    state.meta = {
      ...state.meta,
      ...JSON.parse(rawMeta),
    };
  }
  state.meta.deleted = {
    products: [],
    productVariants: [],
    combos: [],
    promotions: [],
    customers: [],
    debts: [],
    sales: [],
    history: [],
    ...(state.meta.deleted || {}),
  };
  state.products.forEach((p) => {
    p.brand = (p.brand || "").trim();
    p.updatedAt = p.updatedAt || p.createdAt || new Date().toISOString();
    recalcProduct(p);
  });
  state.debts = state.debts.map(normalizeDebt);
  state.customers = state.customers.map(normalizeCustomer);
  state.productVariants = state.productVariants.map(normalizeVariant);
  state.combos = state.combos.map(normalizeCombo);
  state.promotions = state.promotions.map(normalizePromotion);
}

function applyServerData(data) {
  state.products = data.products || [];
  state.history = data.history || [];
  state.sales = data.sales || [];
  state.debts = (data.debts || []).map(normalizeDebt);
  state.customers = (data.customers || []).map(normalizeCustomer);
  state.productVariants = (data.productVariants || []).map(normalizeVariant);
  state.combos = (data.combos || []).map(normalizeCombo);
  state.promotions = (data.promotions || []).map(normalizePromotion);
  state.dashboardCfg = { ...state.dashboardCfg, ...(data.dashboardCfg || {}) };
  state.cfg = {
    ...state.cfg,
    ...(data.cfg || {}),
  };
  state.meta.deleted = {
    products: [],
    productVariants: [],
    combos: [],
    promotions: [],
    customers: [],
    debts: [],
    sales: [],
    history: [],
    ...(data.syncMeta?.deleted || {}),
  };
  state.products.forEach((p) => {
    p.updatedAt = p.updatedAt || p.createdAt || new Date().toISOString();
    recalcProduct(p);
  });
  if (isRemoteDataEffectivelyEmpty(data)) {
    state.cart = [];
    state.filterText = "";
    state.filterCategory = "";
  }
  state.meta.lastSyncAt = data.updatedAt || new Date().toISOString();
}

function parseTimeMs(value) {
  if (!value) return 0;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}

function hasRemotePriority(remoteUpdatedAt) {
  const remoteMs = parseTimeMs(remoteUpdatedAt);
  if (!remoteMs) return false;
  const localBaseMs = parseTimeMs(state.meta.lastSyncAt);
  if (!localBaseMs) return true;
  return remoteMs > localBaseMs + 1000;
}

function saveConflictBackup() {
  try {
    localStorage.setItem(
      CONFLICT_BACKUP_KEY,
      JSON.stringify({
        createdAt: new Date().toISOString(),
        products: state.products,
        history: state.history,
        sales: state.sales,
        debts: state.debts,
        customers: state.customers,
        productVariants: state.productVariants,
        combos: state.combos,
        promotions: state.promotions,
        dashboardCfg: state.dashboardCfg,
        cfg: state.cfg,
        meta: state.meta,
      })
    );
  } catch (_) {}
}

function normalizeDebt(rawDebt) {
  const debt = { ...rawDebt };
  const interestPct = toNumber(debt.interestPct, 0);
  const sourceTotal = toNumber(debt.total ?? 0);
  const derivedBase =
    debt.subtotal != null
      ? toNumber(debt.subtotal, 0)
      : interestPct > 0
      ? Number((sourceTotal / (1 + interestPct / 100)).toFixed(2))
      : sourceTotal;
  const baseTotal = derivedBase;
  const finalTotal = Number((baseTotal * (1 + interestPct / 100)).toFixed(2));
  const paidAmountFromData = toNumber(debt.paidAmount, NaN);
  const inferredPaid = Number.isFinite(paidAmountFromData)
    ? paidAmountFromData
    : Math.max(0, Number((toNumber(debt.total, finalTotal) - toNumber(debt.pending, 0)).toFixed(2)));
  debt.subtotal = baseTotal;
  debt.interestPct = interestPct;
  debt.total = finalTotal;
  debt.paidAmount = Number(inferredPaid.toFixed(2));
  debt.pending = Number(Math.max(0, finalTotal - debt.paidAmount).toFixed(2));
  debt.payments = Array.isArray(debt.payments) ? debt.payments : [];
  debt.items = Array.isArray(debt.items) ? debt.items : [];
  debt.paid = debt.pending <= 0;
  debt.updatedAt = debt.updatedAt || debt.paidAt || debt.date || new Date().toISOString();
  return debt;
}

function normalizeCustomer(rawCustomer) {
  const customer = { ...rawCustomer };
  customer.id = customer.id || uid();
  customer.name = String(customer.name || "").trim();
  customer.phone = String(customer.phone || "").trim();
  customer.creditLimit = toNumber(customer.creditLimit, 0);
  customer.balance = toNumber(customer.balance, 0);
  customer.notes = String(customer.notes || "").trim();
  customer.updatedAt = customer.updatedAt || new Date().toISOString();
  return customer;
}

function normalizeVariant(rawVariant) {
  const variant = { ...rawVariant };
  variant.id = variant.id || uid();
  variant.productId = variant.productId || "";
  variant.sku = String(variant.sku || "").trim();
  variant.attrs = {
    talle: String(variant?.attrs?.talle || "").trim(),
    color: String(variant?.attrs?.color || "").trim(),
    unidad: String(variant?.attrs?.unidad || "").trim(),
  };
  variant.stock = toNumber(variant.stock, 0);
  variant.cost = toNumber(variant.cost, 0);
  variant.price = toNumber(variant.price, 0);
  variant.code = String(variant.code || "").trim();
  variant.updatedAt = variant.updatedAt || new Date().toISOString();
  return variant;
}

function normalizeCombo(rawCombo) {
  const combo = { ...rawCombo };
  combo.id = combo.id || uid();
  combo.name = String(combo.name || "").trim();
  combo.items = Array.isArray(combo.items)
    ? rawCombo.items
        .map((item) => {
          if (typeof item === "string") {
            const byCode = findProductByCode(item);
            const byId = state.products.find((p) => p.id === item);
            const product = byCode || byId;
            return product ? { productId: product.id, qty: 1 } : null;
          }
          if (!item || typeof item !== "object") return null;
          return {
            productId: String(item.productId || "").trim(),
            qty: Math.max(1, Math.floor(toNumber(item.qty, 1))),
          };
        })
        .filter((x) => x && x.productId)
    : [];
  combo.discountPct = toNumber(combo.discountPct, 0);
  combo.fixedPrice = rawCombo.fixedPrice === "" || rawCombo.fixedPrice == null ? "" : toNumber(rawCombo.fixedPrice, 0);
  combo.startAt = rawCombo.startAt ? String(rawCombo.startAt) : "";
  combo.endAt = rawCombo.endAt ? String(rawCombo.endAt) : "";
  combo.active = rawCombo.active !== false;
  combo.updatedAt = combo.updatedAt || new Date().toISOString();
  return combo;
}

function isComboTimeWindowValid(combo, nowMs = Date.now()) {
  const startMs = parseTimeMs(combo.startAt);
  const endMs = parseTimeMs(combo.endAt);
  if (startMs && nowMs < startMs) return false;
  if (endMs && nowMs > endMs) return false;
  return true;
}

function comboStatusText(combo) {
  const nowMs = Date.now();
  if (!combo.active) return "Desactivado";
  const startMs = parseTimeMs(combo.startAt);
  const endMs = parseTimeMs(combo.endAt);
  if (startMs && nowMs < startMs) return "Programado";
  if (endMs && nowMs > endMs) return "Vencido";
  return "Activo";
}

function normalizePromotion(rawPromotion) {
  const promotion = { ...rawPromotion };
  promotion.id = promotion.id || uid();
  promotion.name = String(promotion.name || "").trim();
  promotion.productId = promotion.productId || "";
  promotion.discountPct = toNumber(promotion.discountPct, 0);
  promotion.active = rawPromotion.active !== false;
  promotion.updatedAt = promotion.updatedAt || new Date().toISOString();
  return promotion;
}

async function withTimeout(promise, ms, label) {
  let timerId;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => reject(new Error(`${label} timeout`)), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timerId);
  }
}

function sanitizeForFirestore(value) {
  if (value === undefined) return null;
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(sanitizeForFirestore);
  if (typeof value === "object") {
    const out = {};
    Object.entries(value).forEach(([k, v]) => {
      if (typeof v === "function") return;
      out[k] = sanitizeForFirestore(v);
    });
    return out;
  }
  if (typeof value === "number" && Number.isNaN(value)) return 0;
  return value;
}

/** Documento canónico en cero (misma forma que el guardado normal). */
function buildEmptyServerPayload() {
  const ts = new Date().toISOString();
  return {
    products: [],
    history: [],
    sales: [],
    debts: [],
    customers: [],
    productVariants: [],
    combos: [],
    promotions: [],
    dashboardCfg: { compareDays: 7 },
    cfg: { globalMargin: "", roundingMode: "none" },
    updatedAt: ts,
    syncMeta: {
      deleted: {
        products: [],
        productVariants: [],
        combos: [],
        promotions: [],
        customers: [],
        debts: [],
        sales: [],
        history: [],
      },
    },
  };
}

function isRemoteDataEffectivelyEmpty(data) {
  const d = data || {};
  return (
    (d.products || []).length === 0 &&
    (d.history || []).length === 0 &&
    (d.sales || []).length === 0 &&
    (d.debts || []).length === 0 &&
    (d.customers || []).length === 0 &&
    (d.productVariants || []).length === 0 &&
    (d.combos || []).length === 0 &&
    (d.promotions || []).length === 0
  );
}

/** Si el doc principal no existe: solo vaciamos local si ya hubo al menos una sync con nube (evita borrar datos offline nunca subidos). */
function shouldTreatMissingFirestoreDocAsRemoteReset() {
  return parseTimeMs(state.meta.lastSyncAt) > 0;
}

function uniqueList(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function recordTimestampMs(record) {
  if (!record || typeof record !== "object") return 0;
  return Math.max(
    parseTimeMs(record.updatedAt),
    parseTimeMs(record.paidAt),
    parseTimeMs(record.date),
    parseTimeMs(record.createdAt)
  );
}

function pickPreferredRecord(localRecord, remoteRecord) {
  const l = recordTimestampMs(localRecord);
  const r = recordTimestampMs(remoteRecord);
  if (l === 0 && r === 0) return localRecord ?? remoteRecord;
  return l >= r ? localRecord : remoteRecord;
}

function mergeById(localArr = [], remoteArr = [], deletedIds = []) {
  const map = new Map();
  remoteArr.forEach((item) => {
    if (!item?.id) return;
    map.set(item.id, item);
  });
  localArr.forEach((item) => {
    if (!item?.id) return;
    const prev = map.get(item.id);
    map.set(item.id, prev ? pickPreferredRecord(item, prev) : item);
  });
  const deleted = new Set(deletedIds || []);
  return [...map.values()].filter((item) => item?.id && !deleted.has(item.id));
}

function mergeDeletedMap(localDeleted = {}, remoteDeleted = {}) {
  const keys = [
    "products",
    "productVariants",
    "combos",
    "promotions",
    "customers",
    "debts",
    "sales",
    "history",
  ];
  const out = {};
  keys.forEach((k) => {
    out[k] = uniqueList([...(localDeleted[k] || []), ...(remoteDeleted[k] || [])]);
  });
  return out;
}

function mergeSyncPayload(remoteData = {}, localPayload = {}) {
  const mergedDeleted = mergeDeletedMap(localPayload.syncMeta?.deleted || {}, remoteData.syncMeta?.deleted || {});
  return {
    products: mergeById(localPayload.products || [], remoteData.products || [], mergedDeleted.products),
    history: mergeById(localPayload.history || [], remoteData.history || [], mergedDeleted.history),
    sales: mergeById(localPayload.sales || [], remoteData.sales || [], mergedDeleted.sales),
    debts: mergeById(localPayload.debts || [], remoteData.debts || [], mergedDeleted.debts),
    customers: mergeById(localPayload.customers || [], remoteData.customers || [], mergedDeleted.customers),
    productVariants: mergeById(
      localPayload.productVariants || [],
      remoteData.productVariants || [],
      mergedDeleted.productVariants
    ),
    combos: mergeById(localPayload.combos || [], remoteData.combos || [], mergedDeleted.combos),
    promotions: mergeById(localPayload.promotions || [], remoteData.promotions || [], mergedDeleted.promotions),
    dashboardCfg: { ...(remoteData.dashboardCfg || {}), ...(localPayload.dashboardCfg || {}) },
    cfg: { ...(remoteData.cfg || {}), ...(localPayload.cfg || {}) },
    updatedAt: new Date().toISOString(),
    syncMeta: {
      deleted: mergedDeleted,
    },
  };
}

function markEntityDeleted(moduleName, id) {
  if (!id) return;
  if (!state.meta.deleted || typeof state.meta.deleted !== "object") {
    state.meta.deleted = {};
  }
  if (!Array.isArray(state.meta.deleted[moduleName])) {
    state.meta.deleted[moduleName] = [];
  }
  if (!state.meta.deleted[moduleName].includes(id)) {
    state.meta.deleted[moduleName].push(id);
  }
}

function initFirebase() {
  const cfg = window.FIREBASE_CONFIG;
  if (typeof firebase === "undefined") {
    return;
  }
  if (!cfg || !cfg.projectId || String(cfg.projectId).includes("REEMPLAZAR")) {
    return;
  }
  const app = firebase.apps && firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
  cloud.db = firebase.firestore(app);
  try {
    cloud.db.settings({
      experimentalForceLongPolling: true,
      useFetchStreams: false,
      ignoreUndefinedProperties: true,
      merge: true,
    });
  } catch (_) {
    // Si el runtime ya inicializó settings, seguimos con defaults.
  }
  cloud.enabled = true;
  startRemoteListener();
  if (navigator.onLine) {
    setTimeout(() => {
      flushSync().catch(() => {});
    }, 800);
  }
}

function startRemoteListener() {
  if (!cloud.enabled || !cloud.db) return;
  if (typeof cloud.remoteUnsub === "function") {
    cloud.remoteUnsub();
    cloud.remoteUnsub = null;
  }
  const ref = cloud.db.collection(FIREBASE_DOC_PATH[0]).doc(FIREBASE_DOC_PATH[1]);
  cloud.remoteUnsub = ref.onSnapshot(
    (snap) => {
      if (!snap.exists) {
        if (state.meta.dirty) {
          cloud.remotePending = true;
          scheduleAutoSync();
          return;
        }
        if (!shouldTreatMissingFirestoreDocAsRemoteReset()) return;
        const data = buildEmptyServerPayload();
        applyServerData(data);
        saveLocal();
        renderAll();
        updateSyncStatus();
        toast("Base vaciada (sincronizado)");
        return;
      }
      const data = snap.data() || {};
      const remoteMs = parseTimeMs(data.updatedAt);
      const localMs = parseTimeMs(state.meta.lastSyncAt);
      if (!remoteMs) return;
      if (state.meta.dirty) {
        if (remoteMs > localMs + 1000) {
          cloud.remotePending = true;
          scheduleAutoSync();
        }
        return;
      }
      if (remoteMs <= localMs + 1000) return;
      applyServerData(data);
      saveLocal();
      renderAll();
      updateSyncStatus();
      if (isRemoteDataEffectivelyEmpty(data)) {
        toast("Datos reiniciados desde otro dispositivo");
      } else {
        toast("Datos actualizados desde otro dispositivo");
      }
    },
    () => {}
  );
}

async function syncFromServer() {
  if (!cloud.enabled) throw new Error("Firebase no configurado");
  if (state.meta.dirty) return;
  const snap = await cloud.db.collection(FIREBASE_DOC_PATH[0]).doc(FIREBASE_DOC_PATH[1]).get();
  if (!snap.exists) {
    if (shouldTreatMissingFirestoreDocAsRemoteReset()) {
      const data = buildEmptyServerPayload();
      applyServerData(data);
      saveLocal();
      renderAll();
      updateSyncStatus();
    }
    return;
  }
  const data = snap.data() || {};
  applyServerData(data);
  saveLocal();
  renderAll();
  updateSyncStatus();
}

async function syncToServer() {
  if (!cloud.enabled) return;
  const localPayload = {
    products: state.products,
    history: state.history,
    sales: state.sales,
    debts: state.debts,
    customers: state.customers,
    productVariants: state.productVariants,
    combos: state.combos,
    promotions: state.promotions,
    dashboardCfg: state.dashboardCfg,
    cfg: state.cfg,
    syncMeta: {
      deleted: state.meta.deleted || {},
    },
  };
  const docRef = cloud.db.collection(FIREBASE_DOC_PATH[0]).doc(FIREBASE_DOC_PATH[1]);
  const remoteSnap = await docRef.get();
  const remoteData = remoteSnap.exists ? remoteSnap.data() || {} : {};
  const mergedPayload = sanitizeForFirestore(mergeSyncPayload(remoteData, localPayload));
  await docRef.set(mergedPayload);
  applyServerData(mergedPayload);
  try {
    await withTimeout(createDailyBackupIfNeeded(), SYNC_TIMEOUT_MS, "dailyBackup");
  } catch (_) {
    // El backup no debe bloquear la sincronización principal.
  }
  state.meta.dirty = false;
  state.meta.lastSyncAt = new Date().toISOString();
  cloud.remotePending = false;
  saveLocal();
  updateSyncStatus();
}

async function createDailyBackupIfNeeded() {
  const dayKey = new Date().toISOString().slice(0, 10);
  if (state.meta.lastBackupDay === dayKey) return;
  await cloud.db.collection("apps").doc("stock-distribuidora-backup-" + dayKey).set(
    {
      products: state.products,
      history: state.history,
      sales: state.sales,
      debts: state.debts,
      customers: state.customers,
      productVariants: state.productVariants,
      combos: state.combos,
      promotions: state.promotions,
      dashboardCfg: state.dashboardCfg,
      cfg: state.cfg,
      backupDate: dayKey,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  state.meta.lastBackupDay = dayKey;
}

function markDirty() {
  state.meta.dirty = true;
  saveLocal();
  updateSyncStatus();
  scheduleAutoSync();
}

let autoSyncTimer = null;
function scheduleAutoSync() {
  if (!cloud.enabled || !navigator.onLine || !state.meta.dirty) return;
  if (autoSyncTimer) clearTimeout(autoSyncTimer);
  autoSyncTimer = setTimeout(() => {
    flushSync().catch(() => {});
  }, 1200);
}

async function flushSync(showToast = false) {
  if (!cloud.enabled) {
    if (showToast) toast("Firebase no disponible. Usando datos locales");
    return;
  }
  if (!navigator.onLine) {
    if (showToast) toast("Sin conexion. Se sincroniza al reconectar");
    updateSyncStatus();
    return;
  }
  if (cloud.syncing) return;
  cloud.syncing = true;
  cloud.lastError = "";
  cloud.firestoreOffline = false;
  updateSyncStatus();
  let writeAttempted = false;
  let writeSucceeded = false;
  try {
    if (state.meta.dirty) {
      writeAttempted = true;
      const remoteSnap = await cloud.db.collection(FIREBASE_DOC_PATH[0]).doc(FIREBASE_DOC_PATH[1]).get();
      if (remoteSnap.exists) {
        const remoteData = remoteSnap.data() || {};
        if (hasRemotePriority(remoteData.updatedAt)) {
          saveConflictBackup();
          applyServerData(remoteData);
          state.meta.dirty = false;
          saveLocal();
          renderAll();
          cloud.lastError = "";
          cloud.firestoreOffline = false;
          if (showToast) {
            toast("Se cargaron cambios más nuevos de nube para evitar sobreescritura");
          }
          return;
        }
      }
      await syncToServer();
      writeSucceeded = true;
      cloud.lastError = "";
      cloud.firestoreOffline = false;
      if (showToast) toast("Cambios sincronizados");
      return;
    }
    try {
      await syncFromServer();
      cloud.lastError = "";
      cloud.firestoreOffline = false;
      if (showToast) toast("Sincronizado");
    } catch (readErr) {
      const readCode = readErr?.code ? String(readErr.code) : "";
      const readMessage = readErr?.message ? String(readErr.message) : "";
      const readOfflineLike =
        readCode === "unavailable" ||
        readCode === "failed-precondition" ||
        /client is offline/i.test(readMessage) ||
        /offline/i.test(readMessage);

      if (readOfflineLike) {
        cloud.firestoreOffline = true;
        cloud.lastError = "";
        if (writeAttempted && writeSucceeded) {
          if (showToast) toast("Cambios guardados. Lectura remota pendiente");
        } else if (showToast) {
          toast("Firestore en modo offline");
        }
      } else {
        throw readErr;
      }
    }
  } catch (err) {
    const code = err?.code ? String(err.code) : "";
    const message = err?.message ? String(err.message) : "Error de sincronización";
    const offlineLike =
      code === "unavailable" ||
      code === "failed-precondition" ||
      /client is offline/i.test(message) ||
      /offline/i.test(message);
    if (offlineLike) {
      cloud.firestoreOffline = true;
      cloud.lastError = "";
      if (showToast) toast("Firestore sin conexión. Se mantiene en modo local");
    } else {
      cloud.lastError = code ? `${code}: ${message}` : message;
      if (showToast) {
        const short = code || message;
        toast(`Sync falló: ${short}`);
      }
    }
    try {
      console.error("Sync error:", err);
    } catch (_) {}
  } finally {
    cloud.syncing = false;
    if (!state.meta.dirty && cloud.remotePending && cloud.enabled && navigator.onLine) {
      cloud.remotePending = false;
      syncFromServer().catch(() => {});
    }
    updateSyncStatus();
  }
}

function categories() {
  const set = new Set(state.products.map((p) => p.category).filter(Boolean));
  return [...set].sort((a, b) => a.localeCompare(b, "es"));
}

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

function resolveCategoryName(value) {
  const normalized = normalizeCategory(value);
  if (!normalized) return "";
  const existing = categories().find((c) => c.toLowerCase() === normalized.toLowerCase());
  return existing || normalized;
}

function findProductById(id) {
  return state.products.find((p) => p.id === id);
}

function findProductByCode(code) {
  const normalized = String(code || "").trim().toLowerCase();
  if (!normalized) return null;
  return state.products.find((p) => String(p.code || "").trim().toLowerCase() === normalized) || null;
}

function getCustomerByName(name) {
  const normalized = String(name || "").trim().toLowerCase();
  if (!normalized) return null;
  return state.customers.find((c) => String(c.name || "").trim().toLowerCase() === normalized) || null;
}

function computeCustomerBalance(customerName) {
  const normalized = String(customerName || "").trim().toLowerCase();
  if (!normalized) return 0;
  return state.debts
    .filter((d) => String(d.customerName || "").trim().toLowerCase() === normalized)
    .reduce((acc, d) => acc + toNumber(d.pending), 0);
}

function variantLabel(variant) {
  const attrs = variant.attrs || {};
  const parts = [attrs.talle, attrs.color, attrs.unidad].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Variante";
}

function findVariantById(variantId) {
  return state.productVariants.find((v) => v.id === variantId);
}

function findProductByAnyCode(code) {
  const normalized = String(code || "").trim().toLowerCase();
  if (!normalized) return null;
  const variant = state.productVariants.find((v) => String(v.code || "").trim().toLowerCase() === normalized);
  if (variant) return { type: "variant", variant };
  const product = findProductByCode(code);
  if (product) return { type: "product", product };
  return null;
}

function activePromotionForProduct(productId) {
  return state.promotions.find((p) => p.active && p.productId === productId) || null;
}

function resolveCartUnitPrice(item) {
  if (item.unitPrice != null) return toNumber(item.unitPrice);
  if (item.variantId) {
    const variant = findVariantById(item.variantId);
    if (!variant) return 0;
    const promo = activePromotionForProduct(variant.productId);
    const base = toNumber(variant.price);
    if (!promo) return base;
    return Number((base * (1 - toNumber(promo.discountPct) / 100)).toFixed(2));
  }
  const product = findProductById(item.productId);
  if (!product) return 0;
  const promo = activePromotionForProduct(product.id);
  const base = toNumber(product.price);
  if (!promo) return base;
  return Number((base * (1 - toNumber(promo.discountPct) / 100)).toFixed(2));
}

function normalizeForSearch(str) {
  const s = String(str || "").toLowerCase();
  try {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } catch (_) {
    return s;
  }
}

function productSearchBlob(product) {
  if (!product) return "";
  return [product.name, product.brand, product.category, product.code].filter(Boolean).join(" ");
}

/**
 * Búsqueda “letra por letra”: cada palabra (separada por espacio) debe aparecer en el texto combinado.
 * Ej: "cola mana" → nombre/marca/categoría que contengan ambas partes.
 */
function matchesSearchTokens(blob, rawFilter) {
  const tokens = String(rawFilter || "")
    .trim()
    .split(/\s+/)
    .map((t) => normalizeForSearch(t))
    .filter(Boolean);
  if (!tokens.length) return true;
  const h = normalizeForSearch(blob);
  return tokens.every((t) => h.includes(t));
}

function productMatchesSearchText(product, rawFilter) {
  if (!product) return false;
  return matchesSearchTokens(productSearchBlob(product), rawFilter);
}

function variantMatchesSearchText(variant, product, rawFilter) {
  if (!normalizeForSearch(rawFilter).trim()) return true;
  const pBlob = product ? productSearchBlob(product) : "";
  const attrs = variant.attrs || {};
  const vPart = [variantLabel(variant), variant.sku || "", variant.code || "", attrs.talle || "", attrs.color || "", attrs.unidad || ""]
    .filter(Boolean)
    .join(" ");
  return matchesSearchTokens(`${pBlob} ${vPart}`, rawFilter);
}

function getSaleFilterMatches(rawFilter) {
  const products = state.products.filter((p) => productMatchesSearchText(p, rawFilter));
  const variants = state.productVariants.filter((v) => {
    const product = findProductById(v.productId);
    return variantMatchesSearchText(v, product, rawFilter);
  });
  return { products, variants };
}

function filteredProducts() {
  return state.products.filter((p) => {
    const byText = productMatchesSearchText(p, state.filterText);
    const byCat = !state.filterCategory || p.category === state.filterCategory;
    return byText && byCat;
  });
}

function renderCategories() {
  const cats = categories();
  dom.categoryFilter.innerHTML =
    `<option value="">Todas las categorías</option>` +
    cats.map((c) => `<option value="${c}">${c}</option>`).join("");
  dom.categoryFilter.value = state.filterCategory;
  if (dom.categorySuggestions) {
    dom.categorySuggestions.innerHTML = cats.map((c) => `<option value="${c}"></option>`).join("");
  }
}

function renderAlerts() {
  const low = lowStockProducts();
  dom.alerts.innerHTML = low
    .map((p) => `<div class="alert-item">Stock bajo: ${productDisplayName(p)} (${p.stock}/${p.stockMin})</div>`)
    .join("");
}

function lowStockProducts() {
  return state.products.filter((p) => toNumber(p.stock) <= toNumber(p.stockMin));
}

function renderNotifications() {
  if (!dom.notifBtn || !dom.notifBadge || !dom.notifPanel || !dom.notifList || !dom.notifEmpty) return;
  const low = lowStockProducts();
  const count = low.length;
  dom.notifBadge.classList.toggle("hidden", count === 0);
  dom.notifBadge.classList.toggle("alert-active", count > 0);
  dom.notifBtn.title = count > 0 ? `Notificaciones (${count} alerta${count === 1 ? "" : "s"})` : "Notificaciones";
  dom.notifBtn.setAttribute("aria-label", dom.notifBtn.title);
  dom.notifEmpty.classList.toggle("hidden", count > 0);
  dom.notifList.innerHTML = low
    .map(
      (p) =>
        `<li class="notif-item"><strong>${productDisplayName(p)}</strong><br/>Stock ${toNumber(p.stock)} / Min ${toNumber(
          p.stockMin
        )}</li>`
    )
    .join("");
  dom.notifPanel.classList.toggle("hidden", !ui.notifOpen);
  if (count > 0 && !ui.lowStockToastShown) {
    ui.lowStockToastShown = true;
    toast(`Atención: ${count} producto(s) en stock mínimo o bajo`);
  }
}

function productRow(p) {
  const low = toNumber(p.stock) <= toNumber(p.stockMin);
  return `<tr class="${low ? "low-stock-row" : ""}">
    <td>${low ? `<span class="low-stock-dot" title="Stock mínimo o bajo"></span>` : ""}${p.name}</td>
    <td>${p.brand || "-"}</td>
    <td>${p.category || "-"}</td>
    <td>${toNumber(p.cost).toFixed(2)}</td>
    <td>${effectiveMargin(p).toFixed(2)}</td>
    <td>${toNumber(p.price).toFixed(2)}</td>
    <td>${p.stock}</td>
    <td>${p.stockMin}</td>
    <td>${p.code || "-"}</td>
    <td>
      <button class="btn" onclick="editProduct('${p.id}')">Editar</button>
      <button class="btn primary" onclick="quickSellProduct('${p.id}')">Venta rápida</button>
      <button class="btn danger" onclick="removeProduct('${p.id}')">Eliminar</button>
    </td>
  </tr>`;
}

function productCard(p) {
  const low = toNumber(p.stock) <= toNumber(p.stockMin);
  return `<article class="m-card">
    <div class="m-title">${low ? `<span class="low-stock-dot" title="Stock mínimo o bajo"></span>` : ""}${productDisplayName(
    p
  )}</div>
    <div class="m-meta">${p.category || "-"} | Costo ${toNumber(p.cost).toFixed(2)} | Precio ${toNumber(
    p.price
  ).toFixed(2)}</div>
    <div class="m-meta">Stock ${p.stock} / Min ${p.stockMin}</div>
    <div class="actions">
      <button class="btn" onclick="editProduct('${p.id}')">Editar</button>
      <button class="btn primary" onclick="quickSellProduct('${p.id}')">Venta rápida</button>
      <button class="btn danger" onclick="removeProduct('${p.id}')">Eliminar</button>
    </div>
  </article>`;
}

function renderProducts() {
  const list = filteredProducts();
  dom.productTbody.innerHTML = list.map(productRow).join("");
  dom.mobileCards.innerHTML = list.map(productCard).join("");
  if (dom.catalogSearchMeta) {
    const raw = String(state.filterText || "").trim();
    const n = list.length;
    if (raw) {
      dom.catalogSearchMeta.textContent = `${n} resultado(s) · varias palabras acotan más (ej. «cola mana»)`;
    } else if (state.filterCategory) {
      dom.catalogSearchMeta.textContent = `${n} producto(s) en «${state.filterCategory}»`;
    } else {
      dom.catalogSearchMeta.textContent = `${n} producto(s) en catálogo`;
    }
  }
  syncCatalogProductListVisibilityForFilter();
}

function updateRecountHint() {
  if (!dom.recountDiff) return;
  const pid = dom.countProduct?.value || "";
  const raw = String(dom.countQty?.value ?? "").trim();
  if (!pid) {
    dom.recountDiff.textContent = "Elegí un producto para ver el stock en sistema.";
    return;
  }
  const p = state.products.find((x) => x.id === pid);
  if (!p) {
    dom.recountDiff.textContent = "";
    return;
  }
  const sys = toNumber(p.stock);
  if (raw === "") {
    dom.recountDiff.textContent = `Stock en sistema: ${sys.toFixed(0)} — cargá abajo lo que contaste físicamente.`;
    return;
  }
  const counted = Math.max(0, Math.floor(toNumber(raw)));
  const diff = counted - sys;
  if (diff === 0) {
    dom.recountDiff.textContent = `Coincide con el sistema (${sys.toFixed(0)}). Al aplicar no cambiará el stock.`;
  } else if (diff > 0) {
    dom.recountDiff.textContent = `Sistema: ${sys.toFixed(0)} → Conteo: ${counted} (en depósito hay ${diff} más que en sistema).`;
  } else {
    dom.recountDiff.textContent = `Sistema: ${sys.toFixed(0)} → Conteo: ${counted} (en depósito hay ${Math.abs(diff)} menos que en sistema).`;
  }
}

function historyTypeLabel(type) {
  if (type === "recuento") return "Recuento";
  if (type === "entrada") return "Entrada";
  if (type === "salida") return "Salida";
  if (type === "ajuste") return "Ajuste manual";
  if (type === "cobro") return "Cobro";
  return String(type || "-");
}

function historyQtyLabel(h) {
  if (h.type === "recuento" && h.stockAntes != null && h.stockAntes !== undefined) {
    return `Contado: ${toNumber(h.qty)} · Era en sistema: ${toNumber(h.stockAntes)}`;
  }
  return toNumber(h.qty).toFixed(2);
}

function setSelectOptionsPreservingValue(selectEl, html, previousValue) {
  if (!selectEl) return;
  selectEl.innerHTML = html;
  if (previousValue && [...selectEl.options].some((o) => o.value === previousValue)) {
    selectEl.value = previousValue;
  }
}

function renderSelectors() {
  const prevQuick = dom.quickProduct?.value || "";
  const prevMove = dom.moveProduct?.value || "";
  const prevPromo = dom.promoProduct?.value || "";
  const prevVariant = dom.variantProduct?.value || "";
  const prevComboPick = dom.comboProductSelect?.value || "";
  const prevCustomerPick = dom.customerNameSelect?.value || "";

  const saleFilterRaw = dom.saleProductSearch?.value ?? "";
  const { products: productsForSale, variants: variantsForSale } = getSaleFilterMatches(saleFilterRaw);
  const productOpts = productsForSale.map(
    (p) => `<option value="${p.id}">${productDisplayName(p)} (Stock: ${p.stock})</option>`
  );
  const variantOpts = variantsForSale.map((v) => {
    const product = findProductById(v.productId);
    const name = product ? productDisplayName(product) : "Producto";
    return `<option value="VAR:${v.id}">${name} [${variantLabel(v)}] (Stock: ${toNumber(v.stock).toFixed(0)})</option>`;
  });
  let optsHeader = "";
  if (normalizeForSearch(saleFilterRaw).trim() && productOpts.length === 0 && variantOpts.length === 0) {
    optsHeader = '<option value="">(sin coincidencias — probá otra palabra o vaciá el filtro)</option>';
  }
  const opts = optsHeader + [...productOpts, ...variantOpts].join("");
  setSelectOptionsPreservingValue(dom.quickProduct, opts, prevQuick);
  setSelectOptionsPreservingValue(dom.moveProduct, opts, prevMove);
  if (dom.promoProduct) {
    const promoOpts = [
      '<option value="">Seleccionar producto</option>',
      ...state.products.map((p) => `<option value="${p.id}">${productDisplayName(p)}</option>`),
    ];
    setSelectOptionsPreservingValue(dom.promoProduct, promoOpts.join(""), prevPromo);
  }
  if (dom.variantProduct) {
    const variantProducts = [
      '<option value="">Seleccionar producto base</option>',
      ...state.products.map((p) => `<option value="${p.id}">${productDisplayName(p)}</option>`),
    ];
    setSelectOptionsPreservingValue(dom.variantProduct, variantProducts.join(""), prevVariant);
  }
  if (dom.comboProductSelect) {
    const comboProductOptions = [
      '<option value="">Seleccionar producto</option>',
      ...state.products.map((p) => `<option value="${p.id}">${productDisplayName(p)}</option>`),
    ];
    setSelectOptionsPreservingValue(dom.comboProductSelect, comboProductOptions.join(""), prevComboPick);
  }
  if (dom.customerNameSelect) {
    const customerOptions = [
      '<option value="">Seleccionar cliente cargado (opcional)</option>',
      ...state.customers.map((c) => `<option value="${c.name}">${c.name}</option>`),
    ];
    setSelectOptionsPreservingValue(dom.customerNameSelect, customerOptions.join(""), prevCustomerPick);
  }
  if (dom.countProduct) {
    const prevCount = dom.countProduct.value || "";
    const countOpts = [
      '<option value="">Seleccionar producto</option>',
      ...state.products.map(
        (p) =>
          `<option value="${p.id}">${productDisplayName(p)} · Sistema: ${toNumber(p.stock).toFixed(0)}</option>`
      ),
    ];
    setSelectOptionsPreservingValue(dom.countProduct, countOpts.join(""), prevCount);
  }
  updateRecountHint();
  renderSaleQuickPicks();
}

function escapeHtmlLite(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function salePickEscapeAttr(val) {
  return String(val).replace(/\\/g, "\\\\").replace(/"/g, "&quot;");
}

/** Lista táctil de coincidencias al filtrar en Ventas (PC y móvil). */
function renderSaleQuickPicks() {
  const wrap = dom.saleQuickPickWrap;
  const list = dom.saleQuickPickList;
  const meta = dom.saleQuickPickMeta;
  if (!wrap || !list) return;
  const raw = dom.saleProductSearch?.value ?? "";
  if (!normalizeForSearch(raw).trim()) {
    wrap.classList.add("hidden");
    list.innerHTML = "";
    if (meta) meta.textContent = "";
    return;
  }
  const { products, variants } = getSaleFilterMatches(raw);
  const maxPick = 12;
  const picked = [];
  for (let i = 0; i < products.length && picked.length < maxPick; i++) {
    const p = products[i];
    picked.push({ id: p.id, label: `${productDisplayName(p)} — Stock ${toNumber(p.stock)}` });
  }
  for (let i = 0; i < variants.length && picked.length < maxPick; i++) {
    const v = variants[i];
    const product = findProductById(v.productId);
    const name = product ? productDisplayName(product) : "?";
    picked.push({ id: `VAR:${v.id}`, label: `${name} [${variantLabel(v)}] — Stock ${toNumber(v.stock)}` });
  }
  const total = products.length + variants.length;
  wrap.classList.remove("hidden");
  if (!picked.length) {
    if (meta) meta.textContent = "Sin coincidencias: probá otra palabra o borrá el filtro.";
    list.innerHTML = "";
    return;
  }
  if (meta) {
    const more = total > picked.length ? ` · ${total - picked.length} más en el desplegable` : "";
    meta.textContent = `Mostrando ${picked.length} de ${total} coincidencia(s)${more}. Tocá una opción o usá la lista.`;
  }
  list.innerHTML = picked
    .map(
      (it) =>
        `<button type="button" class="sale-pick-item" data-sale-pick="${salePickEscapeAttr(it.id)}"><span class="sale-pick-label">${escapeHtmlLite(
          it.label
        )}</span></button>`
    )
    .join("");
}

function renderComboDraftItems() {
  if (!dom.comboItemsList) return;
  dom.comboItemsList.innerHTML = ui.comboDraftItems
    .map((item, idx) => {
      const product = findProductById(item.productId);
      const label = product ? productDisplayName(product) : item.productId;
      return `<li>
        <span>${label} x${item.qty}</span>
        <button type="button" class="btn danger" onclick="removeComboDraftItem(${idx})">Quitar</button>
      </li>`;
    })
    .join("");
}

function renderHistory() {
  if (!ui.historyOpen) return;
  const sorted = [...state.history]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 200);
  const top = sorted
    .map(
      (h) =>
        `<tr><td>${new Date(h.date).toLocaleString()}</td><td>${h.productName}</td><td>${historyTypeLabel(h.type)}</td><td>${historyQtyLabel(
          h
        )}</td></tr>`
    )
    .join("");
  dom.historyTbody.innerHTML = top;
  if (dom.historyMobileCards) {
    dom.historyMobileCards.innerHTML = sorted
      .map(
        (h) => `<article class="m-card">
      <div class="m-title">${h.productName || "-"}</div>
      <div class="m-meta">${new Date(h.date).toLocaleString()}</div>
      <div class="m-meta">Tipo: ${historyTypeLabel(h.type)}</div>
      <div class="m-meta">Cantidad: ${historyQtyLabel(h)}</div>
    </article>`
      )
      .join("");
  }
}

function isToday(isoDate) {
  return new Date(isoDate).toDateString() === new Date().toDateString();
}

function renderCashSummary() {
  if (!dom.cashSummary) return;
  const todaySales = state.sales.filter((s) => isToday(s.date));
  const total = todaySales.reduce((a, s) => a + toNumber(s.total), 0);
  const efectivoSales = todaySales
    .filter((s) => s.method === "efectivo")
    // En efectivo no se cuenta el vuelto como ingreso real de caja.
    .reduce((a, s) => a + Math.min(toNumber(s.paid), toNumber(s.total)), 0);
  const transferenciaSales = todaySales
    .filter((s) => s.method === "transferencia")
    .reduce((a, s) => a + Math.min(toNumber(s.paid), toNumber(s.total)), 0);

  const todayDebtPayments = state.debts.flatMap((d) =>
    (d.payments || [])
      // La seña inicial ya está dentro de la venta del día (state.sales),
      // evitar doble conteo en cierre.
      .filter((p) => isToday(p.date) && p.note !== "Seña inicial")
      .map((p) => ({ ...p, debtId: d.id }))
  );
  const efectivoDebtPayments = todayDebtPayments
    .filter((p) => (p.method || "efectivo") === "efectivo")
    .reduce((a, p) => a + toNumber(p.amount), 0);
  const transferenciaDebtPayments = todayDebtPayments
    .filter((p) => p.method === "transferencia")
    .reduce((a, p) => a + toNumber(p.amount), 0);

  const efectivo = efectivoSales + efectivoDebtPayments;
  const transf = transferenciaSales + transferenciaDebtPayments;
  // Pendiente real del dia: se toma de libretas vigentes creadas hoy,
  // no del snapshot historico de la venta, para reflejar pagos posteriores.
  const pendiente = state.debts
    .filter((d) => isToday(d.date) && toNumber(d.pending) > 0.009)
    .reduce((a, d) => a + toNumber(d.pending), 0);
  dom.cashSummary.textContent = `Ventas: ${todaySales.length} | Total vendido: ${total.toFixed(2)} | Efectivo: ${efectivo.toFixed(
    2
  )} | Transferencia: ${transf.toFixed(2)} | Pendiente: ${pendiente.toFixed(2)}`;
}

function renderDashboard() {
  if (!dom.dashboardSummary) return;
  const todaySales = state.sales.filter((s) => isToday(s.date));
  const compareDays = Math.max(1, toNumber(state.dashboardCfg?.compareDays, 7));
  const sinceMs = Date.now() - compareDays * 24 * 60 * 60 * 1000;
  const prevSinceMs = sinceMs - compareDays * 24 * 60 * 60 * 1000;
  const currentWindowSales = state.sales.filter((s) => parseTimeMs(s.date) >= sinceMs);
  const previousWindowSales = state.sales.filter((s) => {
    const ms = parseTimeMs(s.date);
    return ms >= prevSinceMs && ms < sinceMs;
  });
  const currentRevenue = currentWindowSales.reduce((acc, s) => acc + toNumber(s.total), 0);
  const previousRevenue = previousWindowSales.reduce((acc, s) => acc + toNumber(s.total), 0);
  const avgCostRate = state.products.length
    ? state.products.reduce((acc, p) => acc + (toNumber(p.price) > 0 ? toNumber(p.cost) / toNumber(p.price) : 0), 0) /
      state.products.length
    : 0;
  const todayRevenue = todaySales.reduce((acc, s) => acc + toNumber(s.total), 0);
  const estimatedMargin = todayRevenue - todayRevenue * avgCostRate;
  const topMap = new Map();
  todaySales.forEach((sale) => {
    (sale.items || []).forEach((item) => {
      const current = topMap.get(item.name) || { qty: 0, amount: 0 };
      current.qty += toNumber(item.qty);
      current.amount += toNumber(item.subtotal);
      topMap.set(item.name, current);
    });
  });
  const topProducts = [...topMap.entries()]
    .map(([name, v]) => ({ name, qty: v.qty, amount: v.amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  dom.dashboardSummary.textContent = `Ventas hoy: ${todaySales.length} | Ingreso hoy: ${todayRevenue.toFixed(
    2
  )} | Margen real estimado: ${estimatedMargin.toFixed(2)} | Ventana ${compareDays} días: ${currentRevenue.toFixed(2)}`;
  if (dom.dashboardTopProducts) {
    dom.dashboardTopProducts.innerHTML = topProducts
      .map(
        (p) => `<tr>
      <td>${p.name}</td>
      <td>${toNumber(p.qty).toFixed(2)}</td>
      <td>${toNumber(p.amount).toFixed(2)}</td>
    </tr>`
      )
      .join("");
  }
  if (dom.dashboardAlerts) {
    const alerts = [];
    if (previousRevenue > 0 && currentRevenue < previousRevenue * 0.8) {
      alerts.push(
        `Alerta de caída: ventana actual ${currentRevenue.toFixed(2)} vs previa ${previousRevenue.toFixed(2)}`
      );
    }
    if (!topProducts.length) alerts.push("Sin ventas hoy para calcular top de productos.");
    dom.dashboardAlerts.innerHTML = alerts.map((a) => `<div class="alert-item">${a}</div>`).join("");
  }
}

function renderCustomers() {
  if (!dom.customersTbody && !dom.customersMobileCards) return;
  state.customers.forEach((c) => {
    c.balance = Number(computeCustomerBalance(c.name).toFixed(2));
  });
  const rows = [...state.customers].sort((a, b) => a.name.localeCompare(b.name, "es"));
  if (dom.customersTbody) {
    dom.customersTbody.innerHTML = rows
      .map((c) => {
        const limit = toNumber(c.creditLimit, 0);
        const salesCount = state.sales.filter(
          (s) => String(s.customerName || "").trim().toLowerCase() === String(c.name || "").trim().toLowerCase()
        ).length;
        const paymentCount = state.debts
          .filter((d) => String(d.customerName || "").trim().toLowerCase() === String(c.name || "").trim().toLowerCase())
          .reduce((acc, d) => acc + (Array.isArray(d.payments) ? d.payments.length : 0), 0);
        const reminder =
          c.balance > limit && limit > 0
            ? "Excede límite"
            : c.balance > 0
            ? "Tiene pendiente"
            : "Al día";
        return `<tr>
          <td>${c.name}</td>
          <td>${c.phone || "-"}</td>
          <td>${limit.toFixed(2)}</td>
          <td>${toNumber(c.balance).toFixed(2)}</td>
          <td>Ventas: ${salesCount} | Pagos: ${paymentCount}</td>
          <td>${reminder}</td>
          <td><button class="btn" onclick="editCustomer('${c.id}')">Editar</button></td>
        </tr>`;
      })
      .join("");
  }
  if (dom.customersMobileCards) {
    dom.customersMobileCards.innerHTML = rows
      .map((c) => {
        const limit = toNumber(c.creditLimit, 0);
        const paymentCount = state.debts
          .filter((d) => String(d.customerName || "").trim().toLowerCase() === String(c.name || "").trim().toLowerCase())
          .reduce((acc, d) => acc + (Array.isArray(d.payments) ? d.payments.length : 0), 0);
        return `<article class="m-card">
          <div class="m-title">${c.name}</div>
          <div class="m-meta">Tel: ${c.phone || "-"}</div>
          <div class="m-meta">Límite: ${limit.toFixed(2)} | Saldo: ${toNumber(c.balance).toFixed(2)}</div>
          <div class="m-meta">Historial: ${paymentCount} pagos registrados</div>
          <div class="actions"><button class="btn" onclick="editCustomer('${c.id}')">Editar</button></div>
        </article>`;
      })
      .join("");
  }
}

function renderCatalogSmart() {
  const comboItemsLabel = (combo) =>
    (combo.items || [])
      .map((i) => {
        const item = typeof i === "string" ? { productId: i, qty: 1 } : i;
        const p = findProductById(item.productId) || findProductByCode(item.productId);
        const label = p ? productDisplayName(p) : item.productId;
        return `${label} x${Math.max(1, Math.floor(toNumber(item.qty, 1)))}`;
      })
      .join(", ");
  const comboWindowLabel = (combo) =>
    combo.startAt || combo.endAt
      ? `${combo.startAt ? new Date(combo.startAt).toLocaleString() : "-"} -> ${
          combo.endAt ? new Date(combo.endAt).toLocaleString() : "-"
        }`
      : "Sin límite";
  if (dom.variantsTbody) {
    dom.variantsTbody.innerHTML = state.productVariants
      .map((v) => {
        const product = findProductById(v.productId);
        return `<tr>
          <td>${product ? productDisplayName(product) : "-"}</td>
          <td>${variantLabel(v)}</td>
          <td>${v.sku || "-"}</td>
          <td>${toNumber(v.stock).toFixed(0)}</td>
          <td>${toNumber(v.price).toFixed(2)}</td>
        </tr>`;
      })
      .join("");
  }
  if (dom.variantsMobileCards) {
    dom.variantsMobileCards.innerHTML = state.productVariants
      .map((v) => {
        const product = findProductById(v.productId);
        return `<article class="m-card">
          <div class="m-title">${product ? productDisplayName(product) : "-"}</div>
          <div class="m-meta">Variante: ${variantLabel(v)}</div>
          <div class="m-meta">SKU: ${v.sku || "-"}</div>
          <div class="m-meta">Stock: ${toNumber(v.stock).toFixed(0)} | Precio: ${toNumber(v.price).toFixed(2)}</div>
        </article>`;
      })
      .join("");
  }
  if (dom.combosTbody) {
    dom.combosTbody.innerHTML = state.combos
      .map(
        (c) => `<tr>
      <td>${c.name}</td>
      <td>${comboItemsLabel(c) || "-"}</td>
      <td>${toNumber(c.discountPct).toFixed(2)}</td>
      <td>${c.fixedPrice === "" ? "-" : toNumber(c.fixedPrice).toFixed(2)}</td>
      <td>${comboWindowLabel(c)}</td>
      <td>
        <button class="btn" onclick="applyComboToCart('${c.id}')">Agregar</button>
        <button class="btn" onclick="toggleCombo('${c.id}')">${c.active ? "Desactivar" : "Activar"}</button>
        <button class="btn danger" onclick="removeCombo('${c.id}')">Eliminar</button>
      </td>
    </tr>`
      )
      .join("");
  }
  if (dom.combosMobileCards) {
    dom.combosMobileCards.innerHTML = state.combos
      .map(
        (c) => `<article class="m-card">
      <div class="m-title">${c.name}</div>
      <div class="m-meta">${comboItemsLabel(c) || "Sin ítems"}</div>
      <div class="m-meta">Desc: ${toNumber(c.discountPct).toFixed(2)}% | Precio fijo: ${
        c.fixedPrice === "" ? "-" : toNumber(c.fixedPrice).toFixed(2)
      }</div>
      <div class="m-meta">Estado: ${comboStatusText(c)}</div>
      <div class="m-meta">Vigencia: ${comboWindowLabel(c)}</div>
      <div class="actions">
        <button class="btn" onclick="applyComboToCart('${c.id}')">Agregar combo</button>
        <button class="btn" onclick="toggleCombo('${c.id}')">${c.active ? "Desactivar" : "Activar"}</button>
        <button class="btn danger" onclick="removeCombo('${c.id}')">Eliminar</button>
      </div>
    </article>`
      )
      .join("");
  }
  if (dom.promotionsTbody) {
    dom.promotionsTbody.innerHTML = state.promotions
      .map((p) => {
        const product = findProductById(p.productId);
        return `<tr>
          <td>${p.name}</td>
          <td>${product ? productDisplayName(product) : "-"}</td>
          <td>${toNumber(p.discountPct).toFixed(2)}</td>
          <td><button class="btn" onclick="togglePromotion('${p.id}')">${p.active ? "Desactivar" : "Activar"}</button></td>
        </tr>`;
      })
      .join("");
  }
  if (dom.promotionsMobileCards) {
    dom.promotionsMobileCards.innerHTML = state.promotions
      .map((p) => {
        const product = findProductById(p.productId);
        return `<article class="m-card">
          <div class="m-title">${p.name}</div>
          <div class="m-meta">Producto: ${product ? productDisplayName(product) : "-"}</div>
          <div class="m-meta">Descuento: ${toNumber(p.discountPct).toFixed(2)}%</div>
          <div class="actions"><button class="btn" onclick="togglePromotion('${p.id}')">${
            p.active ? "Desactivar" : "Activar"
          }</button></div>
        </article>`;
      })
      .join("");
  }
}

function renderDebts() {
  const pendingDebts = state.debts.filter((d) => toNumber(d.pending) > 0.009);
  const settledDebts = state.debts
    .filter((d) => toNumber(d.pending) <= 0.009)
    .sort((a, b) => new Date(b.paidAt || b.date) - new Date(a.paidAt || a.date))
    .slice(0, 50);
  if (dom.debtsTbody) {
    dom.debtsTbody.innerHTML = pendingDebts
      .map(
        (d) => `<tr>
      <td>${new Date(d.date).toLocaleString()}</td>
      <td>${d.customerName || "-"}</td>
      <td>${d.saleId}</td>
      <td>${toNumber(d.pending).toFixed(2)}</td>
      <td>${toNumber(d.interestPct).toFixed(2)}</td>
      <td>${toNumber(d.total ?? d.pending).toFixed(2)}</td>
      <td>
        <button class="btn" onclick="openDebtDetail('${d.id}')">Ver</button>
        <button class="btn" onclick="openDebtInterestDialog('${d.id}')">Interés</button>
        <button class="btn primary" onclick="openDebtPaymentDialog('${d.id}')">Registrar pago</button>
      </td>
    </tr>`
      )
      .join("");
  }
  if (dom.debtsMobileCards) {
    dom.debtsMobileCards.innerHTML = pendingDebts
      .map(
        (d) => `<article class="m-card">
      <div class="m-title">${d.customerName || d.saleId}</div>
      <div class="m-meta">${new Date(d.date).toLocaleString()}</div>
      <div class="m-meta">Venta: ${d.saleId}</div>
      <div class="m-meta">Interés ${toNumber(d.interestPct).toFixed(2)}%</div>
      <div class="m-meta">Pendiente ${toNumber(d.pending).toFixed(2)} / Total ${toNumber(d.total ?? d.pending).toFixed(
        2
      )}</div>
      <div class="actions">
        <button class="btn" onclick="openDebtDetail('${d.id}')">Ver</button>
        <button class="btn" onclick="openDebtInterestDialog('${d.id}')">Interés</button>
        <button class="btn primary" onclick="openDebtPaymentDialog('${d.id}')">Registrar pago</button>
      </div>
    </article>`
      )
      .join("");
  }
  if (dom.settledDebtsTbody) {
    dom.settledDebtsTbody.innerHTML = settledDebts
      .map(
        (d) => `<tr>
      <td>${new Date(d.paidAt || d.date).toLocaleString()}</td>
      <td>${d.customerName || "-"}</td>
      <td>${d.saleId}</td>
      <td>${toNumber(d.total).toFixed(2)}</td>
      <td>${toNumber(d.paidAmount).toFixed(2)}</td>
      <td><button class="btn" onclick="openDebtDetail('${d.id}')">Ver</button></td>
    </tr>`
      )
      .join("");
  }
  if (dom.settledDebtsMobileCards) {
    dom.settledDebtsMobileCards.innerHTML = settledDebts
      .map(
        (d) => `<article class="m-card">
      <div class="m-title">${d.customerName || d.saleId}</div>
      <div class="m-meta">Saldada: ${new Date(d.paidAt || d.date).toLocaleString()}</div>
      <div class="m-meta">Venta: ${d.saleId}</div>
      <div class="m-meta">Total ${toNumber(d.total).toFixed(2)} | Pagado ${toNumber(d.paidAmount).toFixed(2)}</div>
      <div class="actions"><button class="btn" onclick="openDebtDetail('${d.id}')">Ver</button></div>
    </article>`
      )
      .join("");
  }
}

function cartTotal() {
  return state.cart.reduce((acc, item) => {
    return acc + resolveCartUnitPrice(item) * toNumber(item.qty);
  }, 0);
}

function paymentStatus(total, paid, method) {
  if (method === "fiado") {
    const interestPct = toNumber(dom.fiadoInterestPct?.value, 0);
    const finalTotal = Number((total * (1 + interestPct / 100)).toFixed(2));
    const pending = Math.max(0, finalTotal - paid);
    return `Libreta: total ${finalTotal.toFixed(2)} | Seña ${paid.toFixed(2)} | Pendiente ${pending.toFixed(2)}`;
  }
  if (method === "transferencia") {
    return "Transferencia: cobro completo";
  }
  if (method === "efectivo") {
    const change = paid - total;
    if (change < 0) return `Faltan ${Math.abs(change).toFixed(2)} para cobrar`;
    return `Vuelto: ${change.toFixed(2)}`;
  }
  const pending = total - paid;
  if (pending > 0) return `Transferencia parcial. Saldo pendiente: ${pending.toFixed(2)}`;
  if (pending < 0) return `Transferencia completa. Excedente: ${Math.abs(pending).toFixed(2)}`;
  return "Transferencia completa";
}

function printTicket(sale) {
  const lines = sale.items
    .map(
      (it) =>
        `<tr><td>${it.name}</td><td>${it.qty}</td><td>${toNumber(it.price).toFixed(2)}</td><td>${toNumber(
          it.subtotal
        ).toFixed(2)}</td></tr>`
    )
    .join("");
  const win = window.open("", "_blank", "width=420,height=640");
  if (!win) return;
  win.document.write(`<!doctype html><html><head><title>Ticket</title></head><body>
    <h3>Stock Distribuidora</h3>
    <div>Fecha: ${new Date(sale.date).toLocaleString()}</div>
    <div>Venta: ${sale.id}</div>
    <table border="1" cellspacing="0" cellpadding="4"><thead><tr><th>Producto</th><th>Cant</th><th>Precio</th><th>Subt</th></tr></thead><tbody>${lines}</tbody></table>
    <p>Total: ${sale.total.toFixed(2)}</p>
    <p>Pagado: ${sale.paid.toFixed(2)}</p>
    <p>${sale.method === "efectivo" ? `Vuelto: ${sale.change.toFixed(2)}` : `Pendiente: ${sale.pending.toFixed(2)}`}</p>
  </body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

function renderCart() {
  if (!dom.cartTbody) return;
  const rows = state.cart
    .map((item) => {
      const p = findProductById(item.productId);
      const variant = item.variantId ? findVariantById(item.variantId) : null;
      if (!p || (item.variantId && !variant)) return null;
      const qty = toNumber(item.qty);
      const price = resolveCartUnitPrice(item);
      const subtotal = price * qty;
      return { item, p, variant, qty, price, subtotal };
    })
    .filter(Boolean);
  dom.cartTbody.innerHTML = rows
    .map(
      ({ item, p, variant, qty, price, subtotal }) => `<tr>
        <td>${productDisplayName(p)}${variant ? ` [${variantLabel(variant)}]` : ""}</td>
        <td>${qty}</td>
        <td>${toNumber(price).toFixed(2)}</td>
        <td>${subtotal.toFixed(2)}</td>
        <td><button class="btn danger" onclick="removeFromCart('${item.variantId || item.productId}')">Quitar</button></td>
      </tr>`
    )
    .join("");
  if (dom.cartMobileCards) {
    dom.cartMobileCards.innerHTML = rows
      .map(
        ({ item, p, variant, qty, price, subtotal }) => `<article class="m-card">
          <div class="m-title">${productDisplayName(p)}${variant ? ` [${variantLabel(variant)}]` : ""}</div>
          <div class="m-meta">Cant. ${qty} | Precio ${toNumber(price).toFixed(2)}</div>
          <div class="m-meta">Subtotal ${subtotal.toFixed(2)}</div>
          <div class="actions">
            <button class="btn danger" onclick="removeFromCart('${item.variantId || item.productId}')">Quitar</button>
          </div>
        </article>`
      )
      .join("");
  }
  const total = cartTotal();
  dom.cartTotal.textContent = `Total: ${total.toFixed(2)}`;
  const method = dom.paymentMethod?.value || "efectivo";
  const prevMethod = ui.lastPaymentMethod;
  const paid = method === "transferencia" ? total : toNumber(dom.amountPaid?.value);
  if (method === "transferencia" && dom.amountPaid) {
    dom.amountPaid.value = total.toFixed(2);
    dom.amountPaid.disabled = true;
  } else if (dom.amountPaid) {
    dom.amountPaid.disabled = false;
    if (method === "fiado" && prevMethod !== "fiado") {
      // En fiado la seña siempre se ingresa manualmente.
      dom.amountPaid.value = "0";
    }
  }
  if (dom.customerRow) {
    dom.customerRow.classList.toggle("hidden", method !== "fiado");
  }
  if (dom.fiadoInterestRow) {
    dom.fiadoInterestRow.classList.toggle("hidden", method !== "fiado");
  }
  if (dom.fiadoPaymentMethodRow) {
    dom.fiadoPaymentMethodRow.classList.toggle("hidden", method !== "fiado");
  }
  if (dom.amountPaidLabel) {
    dom.amountPaidLabel.textContent = method === "fiado" ? "Seña entregada" : "Monto pagado";
  }
  dom.paymentSummary.textContent = paymentStatus(total, paid, method);
  ui.lastPaymentMethod = method;
}

function renderAll() {
  state.debts = state.debts.map(normalizeDebt);
  state.customers = state.customers.map(normalizeCustomer);
  state.productVariants = state.productVariants.map(normalizeVariant);
  state.combos = state.combos.map(normalizeCombo);
  state.promotions = state.promotions.map(normalizePromotion);
  dom.globalMargin.value = state.cfg.globalMargin == null ? "" : state.cfg.globalMargin;
  dom.roundingMode.value = state.cfg.roundingMode;
  renderCategories();
  renderAlerts();
  renderProducts();
  renderSelectors();
  renderDashboard();
  renderCustomers();
  renderCatalogSmart();
  renderComboDraftItems();
  renderHistory();
  renderCashSummary();
  renderDebts();
  renderCart();
  renderNotifications();
  applyCurrentView();
}

function openProductDialog(product = null) {
  dom.dialogTitle.textContent = product ? "Editar producto" : "Nuevo producto";
  dom.productId.value = product?.id || "";
  $("name").value = product?.name || "";
  $("brand").value = product?.brand || "";
  $("category").value = product?.category || "";
  $("cost").value = product?.cost ?? "";
  $("margin").value = product?.margin ?? "";
  $("stock").value = product?.stock ?? "";
  $("stockMin").value = product?.stockMin ?? "";
  $("code").value = product?.code || "";
  dom.productDialog.showModal();
}

window.editProduct = (id) => {
  const p = state.products.find((x) => x.id === id);
  if (p) openProductDialog(p);
};

window.removeProduct = async (id) => {
  const confirmDelete = await openAppPromptDialog({
    title: "Eliminar producto",
    message: "¿Eliminar producto? Esta acción no se puede deshacer.",
    okText: "Eliminar",
  });
  if (!confirmDelete.confirmed) return;
  const deletedVariantIds = state.productVariants.filter((v) => v.productId === id).map((v) => v.id);
  const deletedPromotionIds = state.promotions.filter((p) => p.productId === id).map((p) => p.id);
  state.products = state.products.filter((p) => p.id !== id);
  state.productVariants = state.productVariants.filter((v) => v.productId !== id);
  state.promotions = state.promotions.filter((p) => p.productId !== id);
  markEntityDeleted("products", id);
  deletedVariantIds.forEach((variantId) => markEntityDeleted("productVariants", variantId));
  deletedPromotionIds.forEach((promotionId) => markEntityDeleted("promotions", promotionId));
  markDirty();
  saveLocal();
  renderAll();
  try {
    await syncToServer();
  } catch (_) {}
};

window.removeFromCart = (itemId) => {
  state.cart = state.cart.filter((i) => (i.variantId || i.productId) !== itemId);
  markDirty();
  renderCart();
};

window.editCustomer = (customerId) => {
  const customer = state.customers.find((c) => c.id === customerId);
  if (!customer || !dom.customerForm) return;
  dom.customerId.value = customer.id;
  dom.customerFullName.value = customer.name;
  dom.customerPhone.value = customer.phone || "";
  dom.customerLimit.value = toNumber(customer.creditLimit, 0).toFixed(2);
  dom.customerNotes.value = customer.notes || "";
};

window.togglePromotion = (promotionId) => {
  const promotion = state.promotions.find((p) => p.id === promotionId);
  if (!promotion) return;
  promotion.active = !promotion.active;
  promotion.updatedAt = new Date().toISOString();
  markDirty();
  renderAll();
};

window.applyComboToCart = (comboId) => {
  const combo = state.combos.find((c) => c.id === comboId && c.active);
  if (!combo) return;
  if (!isComboTimeWindowValid(combo)) {
    toast(`Combo no disponible (${comboStatusText(combo)})`);
    return;
  }
  const items = Array.isArray(combo.items) ? combo.items : [];
  if (!items.length) {
    toast("Combo sin ítems");
    return;
  }
  const normalizedItems = items
    .map((item) =>
      typeof item === "string"
        ? (() => {
            const byCode = findProductByCode(item);
            const byId = state.products.find((p) => p.id === item);
            const product = byCode || byId;
            return product ? { productId: product.id, qty: 1 } : null;
          })()
        : { productId: item.productId, qty: Math.max(1, Math.floor(toNumber(item.qty, 1))) }
    )
    .filter((x) => x && x.productId);
  const products = normalizedItems
    .map((i) => ({ product: findProductById(i.productId), qty: i.qty }))
    .filter((x) => x.product);
  if (!products.length) {
    toast("No se encontraron productos del combo");
    return;
  }
  const regularTotal = products.reduce((acc, x) => acc + toNumber(x.product.price) * x.qty, 0);
  let totalAfter = regularTotal;
  if (combo.fixedPrice !== "" && combo.fixedPrice != null) {
    totalAfter = toNumber(combo.fixedPrice, regularTotal);
  } else if (toNumber(combo.discountPct, 0) > 0) {
    totalAfter = regularTotal * (1 - toNumber(combo.discountPct, 0) / 100);
  }
  const factor = regularTotal > 0 ? totalAfter / regularTotal : 1;
  products.forEach((x) => {
    addToCart(x.product.id, x.qty, { comboId: combo.id, unitPrice: toNumber(x.product.price) * factor });
  });
  toast(`Combo agregado: ${combo.name}`);
};

window.toggleCombo = async (comboId) => {
  const combo = state.combos.find((c) => c.id === comboId);
  if (!combo) return;
  combo.active = !combo.active;
  combo.updatedAt = new Date().toISOString();
  markDirty();
  renderAll();
  try {
    await flushSync();
  } catch (_) {}
};

window.removeCombo = async (comboId) => {
  const ask = await openAppPromptDialog({
    title: "Eliminar combo",
    message: "¿Seguro que querés eliminar este combo?",
    okText: "Eliminar",
  });
  if (!ask.confirmed) return;
  state.combos = state.combos.filter((c) => c.id !== comboId);
  markEntityDeleted("combos", comboId);
  markDirty();
  renderAll();
  try {
    await flushSync();
  } catch (_) {}
};

window.removeComboDraftItem = (idx) => {
  ui.comboDraftItems = ui.comboDraftItems.filter((_, i) => i !== Number(idx));
  renderComboDraftItems();
};

function addToCart(productSelectionId, qty, options = {}) {
  const selection = String(productSelectionId || "");
  const variantId = selection.startsWith("VAR:") ? selection.slice(4) : "";
  const variant = variantId ? findVariantById(variantId) : null;
  const productId = variant ? variant.productId : selection;
  const p = findProductById(productId);
  if (!p) {
    toast("Selecciona un producto");
    return false;
  }
  if (variantId && !variant) {
    toast("Variante inválida");
    return false;
  }
  if (qty <= 0) {
    toast("Cantidad invalida");
    return false;
  }
  const existing = state.cart.find((i) => i.productId === productId && (i.variantId || "") === variantId);
  if (existing) {
    existing.qty = toNumber(existing.qty) + qty;
  } else {
    const cartItem = { productId, qty };
    if (variantId) cartItem.variantId = variantId;
    if (options.comboId) cartItem.comboId = options.comboId;
    if (options.unitPrice != null) cartItem.unitPrice = Number(toNumber(options.unitPrice).toFixed(2));
    state.cart.push(cartItem);
  }
  markDirty();
  renderCart();
  return true;
}

window.quickSellProduct = (productId) => {
  dom.quickProduct.value = productId;
  dom.quickQty.value = "1";
  const ok = addToCart(productId, 1);
  if (ok) toast("Producto agregado a venta rápida");
};

function recalcDebtTotals(debt) {
  debt.subtotal = toNumber(debt.subtotal ?? debt.total ?? 0);
  debt.interestPct = toNumber(debt.interestPct, 0);
  debt.total = Number((debt.subtotal * (1 + debt.interestPct / 100)).toFixed(2));
  debt.paidAmount = Number(toNumber(debt.paidAmount, 0).toFixed(2));
  debt.pending = Number(Math.max(0, debt.total - debt.paidAmount).toFixed(2));
  debt.paid = debt.pending <= 0;
}

function openDebtPaymentReceiptWindow(debt, payment) {
  const win = window.open("", "_blank", "width=420,height=640");
  if (!win) return null;
  win.document.write(`<!doctype html><html><head><title>Comprobante de pago</title></head><body>
    <h3>Comprobante de pago - Libreta</h3>
    <div>Fecha: ${new Date(payment.date).toLocaleString()}</div>
    <div>Cliente: ${debt.customerName || "-"}</div>
    <div>Venta: ${debt.saleId}</div>
    <div>Forma de pago: ${payment.method || "efectivo"}</div>
    <div>Monto entregado: ${toNumber(payment.amount).toFixed(2)}</div>
    <div>Saldo pendiente actual: ${toNumber(debt.pending).toFixed(2)}</div>
    <div>Total libreta: ${toNumber(debt.total).toFixed(2)}</div>
  </body></html>`);
  win.document.close();
  return win;
}

window.printDebtPaymentReceipt = (debtId, paymentId) => {
  const debt = state.debts.find((d) => d.id === debtId);
  if (!debt) return;
  const payment = (debt.payments || []).find((p) => p.id === paymentId);
  if (!payment) return;
  const win = openDebtPaymentReceiptWindow(debt, payment);
  if (!win) return;
  win.focus();
  win.print();
};

window.downloadDebtPaymentPdf = (debtId, paymentId) => {
  const debt = state.debts.find((d) => d.id === debtId);
  if (!debt) return;
  const payment = (debt.payments || []).find((p) => p.id === paymentId);
  if (!payment) return;
  const win = openDebtPaymentReceiptWindow(debt, payment);
  if (!win) return;
  win.focus();
  win.print();
  toast("En el diálogo de impresión, elegí 'Guardar como PDF'");
};

window.openDebtPaymentDialog = (debtId) => {
  const debt = state.debts.find((d) => d.id === debtId);
  if (!debt || debt.paid) return;
  dom.debtPaymentId.value = debt.id;
  dom.debtPaymentCustomer.value = debt.customerName || debt.saleId;
  dom.debtPaymentPending.value = `Pendiente: ${toNumber(debt.pending).toFixed(2)}`;
  dom.debtPaymentAmount.value = "";
  if (dom.debtPaymentMethod) dom.debtPaymentMethod.value = "efectivo";
  dom.debtPaymentDialog.showModal();
};

async function registerDebtPayment(debtId, amount, method = "efectivo") {
  const debt = state.debts.find((d) => d.id === debtId);
  if (!debt || debt.paid) return false;
  const currentPending = toNumber(debt.pending);
  if (amount <= 0) {
    toast("Monto invalido");
    return false;
  }
  if (amount > currentPending) {
    toast("El pago supera el pendiente");
    return false;
  }
  debt.paidAmount = Number((toNumber(debt.paidAmount) + amount).toFixed(2));
  debt.pending = Number(Math.max(0, currentPending - amount).toFixed(2));
  debt.payments = Array.isArray(debt.payments) ? debt.payments : [];
  debt.payments.push({ id: uid(), date: new Date().toISOString(), amount, method });
  debt.paid = debt.pending <= 0;
  debt.paidAt = new Date().toISOString();
  debt.updatedAt = debt.paidAt;
  state.history.push({
    id: uid(),
    date: debt.paidAt,
    updatedAt: debt.paidAt,
    productId: "PAGO",
    productName: `Pago libreta ${debt.customerName || debt.saleId}`,
    type: "cobro",
    qty: amount,
  });
  markDirty();
  renderAll();
  toast(debt.paid ? "Cuenta saldada" : `Pago registrado. Pendiente: ${debt.pending.toFixed(2)}`);
  try {
    await flushSync();
  } catch (_) {}
  return true;
}

window.openDebtInterestDialog = (debtId) => {
  const debt = state.debts.find((d) => d.id === debtId);
  if (!debt || debt.paid) return;
  dom.debtInterestId.value = debt.id;
  dom.debtInterestCustomer.value = debt.customerName || debt.saleId;
  dom.debtInterestPct.value = toNumber(debt.interestPct).toFixed(2);
  dom.debtInterestDialog.showModal();
};

window.openDebtDetail = (debtId) => {
  const debt = state.debts.find((d) => d.id === debtId);
  if (!debt || !dom.debtDetailContent) return;
  const itemsHtml = (debt.items || [])
    .map((it) => `<div class="debt-detail-item">- ${it.name} | Cant: ${it.qty} | Subtotal: ${toNumber(it.subtotal).toFixed(2)}</div>`)
    .join("");
  const paymentsHtml = (debt.payments || [])
    .map(
      (p) =>
        `<div class="debt-detail-item">
          ${new Date(p.date).toLocaleString()} - Pago: ${toNumber(p.amount).toFixed(2)} (${p.method || "efectivo"})
          <button type="button" class="btn" onclick="printDebtPaymentReceipt('${debt.id}','${p.id}')">Comprobante</button>
          <button type="button" class="btn" onclick="downloadDebtPaymentPdf('${debt.id}','${p.id}')">PDF</button>
        </div>`
    )
    .join("");
  dom.debtDetailContent.innerHTML = `
    <section class="debt-detail-block">
      <h4>Resumen</h4>
      <div class="debt-detail-item">Cliente: ${debt.customerName || "-"}</div>
      <div class="debt-detail-item">Venta: ${debt.saleId}</div>
      <div class="debt-detail-item">Subtotal: ${toNumber(debt.subtotal).toFixed(2)}</div>
      <div class="debt-detail-item">Interés: ${toNumber(debt.interestPct).toFixed(2)}%</div>
      <div class="debt-detail-item">Total final: ${toNumber(debt.total).toFixed(2)}</div>
      <div class="debt-detail-item">Pagado: ${toNumber(debt.paidAmount).toFixed(2)}</div>
      <div class="debt-detail-item">Pendiente: ${toNumber(debt.pending).toFixed(2)}</div>
    </section>
    <section class="debt-detail-block">
      <h4>Productos</h4>
      ${itemsHtml || '<div class="debt-detail-item">Sin detalle de productos.</div>'}
    </section>
    <section class="debt-detail-block">
      <h4>Movimientos</h4>
      ${paymentsHtml || '<div class="debt-detail-item">Sin pagos registrados.</div>'}
    </section>
  `;
  dom.debtDetailDialog.showModal();
};

function registerMovement(productId, type, qty) {
  const p = state.products.find((x) => x.id === productId);
  if (!p) return false;
  const n = toNumber(qty);
  if (!n) return false;
  if (type === "entrada") p.stock = toNumber(p.stock) + n;
  if (type === "salida") {
    if (toNumber(p.stock) - n < 0) {
      toast(`Stock insuficiente: ${productDisplayName(p)}`);
      return false;
    }
    p.stock = toNumber(p.stock) - n;
  }
  if (type === "ajuste") p.stock = n;
  p.updatedAt = new Date().toISOString();
  state.history.push({
    id: uid(),
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productId,
    productName: productDisplayName(p),
    type,
    qty: n,
  });
  return true;
}

function registerRecuento(productId, countedQtyRaw) {
  const p = state.products.find((x) => x.id === productId);
  if (!p) {
    toast("Producto no encontrado");
    return false;
  }
  const raw = String(countedQtyRaw ?? "").trim();
  if (raw === "") {
    toast("Ingresá la cantidad contada");
    return false;
  }
  const counted = Math.max(0, Math.floor(toNumber(raw)));
  const old = toNumber(p.stock);
  if (counted === old) {
    toast("Sin diferencia: el stock ya coincide con el conteo");
    return false;
  }
  p.stock = counted;
  p.updatedAt = new Date().toISOString();
  state.history.push({
    id: uid(),
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productId,
    productName: productDisplayName(p),
    type: "recuento",
    qty: counted,
    stockAntes: old,
  });
  return true;
}

function exportHistoryCsv() {
  const prettyType = (h) => {
    const type = h.type;
    if (type === "recuento" && h.stockAntes != null && h.stockAntes !== undefined) {
      return `Recuento (sistema antes: ${toNumber(h.stockAntes)})`;
    }
    if (type === "entrada") return "Entrada";
    if (type === "salida") return "Salida";
    if (type === "ajuste") return "Ajuste manual";
    if (type === "cobro") return "Cobro";
    return String(type || "-");
  };
  const stamp = new Date().toISOString().slice(0, 10);
  const rows = [...state.history]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((h, idx) => ({
      Nro: idx + 1,
      Fecha: new Date(h.date).toLocaleString("es-AR"),
      Producto: h.productName || "-",
      Tipo: prettyType(h),
      Cantidad: h.type === "recuento" ? String(toNumber(h.qty)) : toNumber(h.qty).toFixed(2),
    }));

  if (window.XLSX) {
    const ws = window.XLSX.utils.json_to_sheet(rows, {
      header: ["Nro", "Fecha", "Producto", "Tipo", "Cantidad"],
    });
    ws["!cols"] = [{ wch: 7 }, { wch: 22 }, { wch: 34 }, { wch: 18 }, { wch: 12 }];
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Historial");
    window.XLSX.writeFile(wb, `historial_movimientos_${stamp}.xlsx`);
    return;
  }

  const normalize = (value) => String(value ?? "").replace(/\r?\n|\r/g, " ").trim();
  const escapeCsv = (value) => `"${normalize(value).replaceAll('"', '""')}"`;
  const csvHeader = ["Nro", "Fecha", "Producto", "Tipo", "Cantidad"];
  const csvLines = [
    "sep=;",
    csvHeader.map(escapeCsv).join(";"),
    ...rows.map((r) =>
      [r.Nro, r.Fecha, r.Producto, r.Tipo, r.Cantidad].map(escapeCsv).join(";")
    ),
  ];
  const csv = `\uFEFF${csvLines.join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `historial_movimientos_${stamp}.csv`;
  a.click();
  toast("No se pudo cargar Excel. Se descargó CSV compatible.");
}

dom.newProductBtn.addEventListener("click", () => openProductDialog());
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    setCurrentView(btn.dataset.viewBtn || "home");
  });
});
dom.customerNameSelect?.addEventListener("change", () => {
  if (!dom.customerName) return;
  const selected = dom.customerNameSelect.value || "";
  if (selected) dom.customerName.value = selected;
});
dom.themeSelect?.addEventListener("change", (e) => {
  applyTheme(e.target.value);
});
dom.cancelDialogBtn.addEventListener("click", () => dom.productDialog.close());
dom.cancelDebtPaymentBtn?.addEventListener("click", () => dom.debtPaymentDialog.close());
dom.cancelDebtInterestBtn?.addEventListener("click", () => dom.debtInterestDialog.close());
dom.notifBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  ui.notifOpen = !ui.notifOpen;
  renderNotifications();
});

document.addEventListener("click", (e) => {
  if (!ui.notifOpen) return;
  if (!dom.notifPanel || !dom.notifBtn) return;
  const clickedInsidePanel = dom.notifPanel.contains(e.target);
  const clickedButton = dom.notifBtn.contains(e.target);
  if (!clickedInsidePanel && !clickedButton) {
    ui.notifOpen = false;
    renderNotifications();
  }
});

dom.debtPaymentForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await runWithAppLoading(async () => {
    const debtId = dom.debtPaymentId.value;
    const amount = toNumber(dom.debtPaymentAmount.value);
    const method = dom.debtPaymentMethod?.value || "efectivo";
    const ok = await registerDebtPayment(debtId, amount, method);
    if (ok) dom.debtPaymentDialog.close();
  }, "Registrando pago...");
});

dom.debtInterestForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await runWithAppLoading(async () => {
    const debt = state.debts.find((d) => d.id === dom.debtInterestId.value);
    if (!debt || debt.paid) return;
    debt.interestPct = toNumber(dom.debtInterestPct.value, 0);
    recalcDebtTotals(debt);
    debt.updatedAt = new Date().toISOString();
    markDirty();
    renderAll();
    toast(`Interés actualizado. Pendiente: ${debt.pending.toFixed(2)}`);
    dom.debtInterestDialog.close();
    try {
      await flushSync();
    } catch (_) {}
  }, "Actualizando interés...");
});

dom.productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await runWithAppLoading(async () => {
    const id = dom.productId.value || uid();
    const existing = state.products.find((p) => p.id === id);
    const name = $("name").value.trim();
    const brand = $("brand").value.trim();
    const category = resolveCategoryName($("category").value);
    if (!name || !brand || !category) {
      toast("Nombre, marca y categoria son obligatorios");
      return;
    }
    const duplicated = state.products.find(
      (p) =>
        p.id !== id &&
        p.name.trim().toLowerCase() === name.toLowerCase() &&
        (p.brand || "").trim().toLowerCase() === brand.toLowerCase()
    );
    if (duplicated) {
      toast("Ya existe ese producto con la misma marca");
      return;
    }
    const next = {
      id,
      name,
      brand,
      category,
      cost: toNumber($("cost").value),
      margin: $("margin").value === "" ? "" : toNumber($("margin").value),
      stock: toNumber($("stock").value),
      stockMin: toNumber($("stockMin").value),
      code: $("code").value.trim(),
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    recalcProduct(next);
    if (existing) {
      Object.assign(existing, next);
    } else {
      state.products.push(next);
    }
    markDirty();
    dom.productDialog.close();
    saveLocal();
    renderAll();
    toast("Producto guardado");
    try {
      await syncToServer();
    } catch (_) {}
  }, "Guardando producto...");
});

dom.searchInput.addEventListener("input", () => {
  ui.catalogListForcedClosed = false;
  state.filterText = dom.searchInput.value;
  renderProducts();
});

dom.saleProductSearch?.addEventListener("input", () => {
  renderSelectors();
});

dom.saleQuickPickList?.addEventListener("click", (e) => {
  const btn = e.target.closest(".sale-pick-item");
  if (!btn || !dom.quickProduct) return;
  const val = btn.getAttribute("data-sale-pick");
  if (!val) return;
  if ([...dom.quickProduct.options].some((o) => o.value === val)) {
    dom.quickProduct.value = val;
    try {
      dom.quickProduct.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (_) {}
  }
});

dom.categoryFilter.addEventListener("change", () => {
  ui.catalogListForcedClosed = false;
  state.filterCategory = dom.categoryFilter.value;
  renderProducts();
});

dom.applyGlobalBtn.addEventListener("click", async () => {
  await runWithAppLoading(async () => {
    const raw = String(dom.globalMargin.value ?? "").trim();
    if (!raw) {
      toast("Ingresá un % de ganancia global");
      dom.globalMargin.focus();
      return;
    }
    state.cfg.globalMargin = toNumber(raw, getGlobalMarginValue());
    state.products.forEach((p) => {
      p.margin = "";
      recalcProduct(p);
    });
    markDirty();
    saveLocal();
    renderAll();
    try {
      await syncToServer();
    } catch (_) {}
  }, "Aplicando configuración global...");
});

dom.roundingMode.addEventListener("change", async () => {
  await runWithAppLoading(async () => {
    state.cfg.roundingMode = dom.roundingMode.value;
    state.products.forEach(recalcProduct);
    markDirty();
    saveLocal();
    renderAll();
    try {
      await syncToServer();
    } catch (_) {}
  }, "Actualizando redondeo...");
});

dom.bulkIncreaseBtn.addEventListener("click", async () => {
  const pctPrompt = await openAppPromptDialog({
    title: "Subir precios",
    message: "Incrementar costo en %",
    okText: "Aplicar",
    showInput: true,
    inputLabel: "Porcentaje",
    inputPlaceholder: "Ej: 5",
    inputValue: "5",
  });
  if (!pctPrompt.confirmed) return;
  await runWithAppLoading(async () => {
    const n = toNumber(pctPrompt.value);
    state.products.forEach((p) => {
      p.cost = toNumber(p.cost) * (1 + n / 100);
      recalcProduct(p);
    });
    markDirty();
    saveLocal();
    renderAll();
    try {
      await syncToServer();
    } catch (_) {}
  }, "Actualizando precios...");
});

dom.resetAllDataBtn?.addEventListener("click", async () => {
  const finalConfirm = await openAppPromptDialog({
    title: "Borrar todos los datos",
    message: 'Acción irreversible. Escribí "BORRAR TODO" y luego presioná Borrar todo.',
    okText: "Borrar todo",
    showInput: true,
    inputLabel: "Confirmación",
    inputPlaceholder: "BORRAR TODO",
    inputValue: "",
  });
  const normalizedPhrase = String(finalConfirm.value || "")
    .trim()
    .toUpperCase();
  if (!finalConfirm.confirmed || normalizedPhrase !== "BORRAR TODO") {
    toast("Cancelado");
    return;
  }

  await runWithAppLoading(async () => {
    let serverPayload = null;
    try {
      cloud.syncing = true;
      updateSyncStatus();
      serverPayload = await deleteFirestoreAppData();
    } catch (_) {
      toast("No se pudo vaciar la nube. Revisá conexión o probá de nuevo.");
    } finally {
      cloud.syncing = false;
    }

    resetStateData();
    if (serverPayload) {
      applyServerData(serverPayload);
    }
    resetLocalStorageData();
    saveLocal();
    cloud.lastError = "";
    cloud.firestoreOffline = false;
    renderAll();
    updateSyncStatus();
    toast(serverPayload ? "Datos borrados en este equipo y en la nube" : "Datos borrados en este equipo (nube pendiente)");
  }, "Borrando datos...");
});

dom.customerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await runWithAppLoading(async () => {
    const id = dom.customerId?.value || uid();
    const name = String(dom.customerFullName?.value || "").trim();
    if (!name) {
      toast("Nombre de cliente obligatorio");
      return;
    }
    const existing = state.customers.find((c) => c.id === id);
    const payload = normalizeCustomer({
      id,
      name,
      phone: dom.customerPhone?.value || "",
      creditLimit: toNumber(dom.customerLimit?.value, 0),
      notes: dom.customerNotes?.value || "",
      balance: existing?.balance || computeCustomerBalance(name),
      updatedAt: new Date().toISOString(),
    });
    if (existing) Object.assign(existing, payload);
    else state.customers.push(payload);
    if (dom.customerId) dom.customerId.value = "";
    if (dom.customerForm) dom.customerForm.reset();
    markDirty();
    renderAll();
    try {
      await flushSync();
    } catch (_) {}
  }, "Guardando cliente...");
});

dom.variantForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await runWithAppLoading(async () => {
    const productId = dom.variantProduct?.value || "";
    const sku = String(dom.variantSku?.value || "").trim();
    if (!productId || !sku) {
      toast("Selecciona producto y SKU de variante");
      return;
    }
    const payload = normalizeVariant({
      id: uid(),
      productId,
      sku,
      attrs: {
        color: dom.variantColor?.value || "",
        talle: dom.variantSize?.value || "",
        unidad: dom.variantUnit?.value || "",
      },
      stock: toNumber(dom.variantStock?.value, 0),
      cost: toNumber(dom.variantCost?.value, 0),
      price: toNumber(dom.variantPrice?.value, 0),
      code: dom.variantCode?.value || "",
      updatedAt: new Date().toISOString(),
    });
    state.productVariants.push(payload);
    dom.variantForm?.reset();
    markDirty();
    renderAll();
    try {
      await flushSync();
    } catch (_) {}
  }, "Guardando variante...");
});

dom.comboForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await runWithAppLoading(async () => {
    const name = String(dom.comboName?.value || "").trim();
    const items = ui.comboDraftItems.map((x) => ({ productId: x.productId, qty: x.qty }));
    if (!name || !items.length) {
      toast("Completa nombre y agrega ítems al combo");
      return;
    }
    state.combos.push(
      normalizeCombo({
        id: uid(),
        name,
        items,
        discountPct: toNumber(dom.comboDiscountPct?.value, 0),
        fixedPrice: dom.comboFixedPrice?.value === "" ? "" : toNumber(dom.comboFixedPrice?.value, 0),
        startAt: dom.comboStartAt?.value ? new Date(dom.comboStartAt.value).toISOString() : "",
        endAt: dom.comboEndAt?.value ? new Date(dom.comboEndAt.value).toISOString() : "",
        active: true,
        updatedAt: new Date().toISOString(),
      })
    );
    dom.comboForm?.reset();
    ui.comboDraftItems = [];
    renderComboDraftItems();
    markDirty();
    renderAll();
    try {
      await flushSync();
    } catch (_) {}
  }, "Guardando combo...");
});

dom.addComboItemBtn?.addEventListener("click", () => {
  const productId = String(dom.comboProductSelect?.value || "").trim();
  const qty = Math.max(1, Math.floor(toNumber(dom.comboProductQty?.value, 1)));
  if (!productId) {
    toast("Selecciona un producto para el combo");
    return;
  }
  const existing = ui.comboDraftItems.find((i) => i.productId === productId);
  if (existing) existing.qty += qty;
  else ui.comboDraftItems.push({ productId, qty });
  if (dom.comboProductQty) dom.comboProductQty.value = "1";
  renderComboDraftItems();
});

dom.promoForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await runWithAppLoading(async () => {
    const productId = dom.promoProduct?.value || "";
    const name = String(dom.promoName?.value || "").trim();
    if (!productId || !name) {
      toast("Completa promoción y producto");
      return;
    }
    state.promotions.push(
      normalizePromotion({
        id: uid(),
        name,
        productId,
        discountPct: toNumber(dom.promoDiscountPct?.value, 0),
        active: true,
        updatedAt: new Date().toISOString(),
      })
    );
    dom.promoForm?.reset();
    markDirty();
    renderAll();
    try {
      await flushSync();
    } catch (_) {}
  }, "Guardando promoción...");
});

dom.addToCartBtn.addEventListener("click", () => {
  const productId = dom.quickProduct.value;
  const qty = toNumber(dom.quickQty.value);
  const ok = addToCart(productId, qty);
  if (ok) toast("Producto agregado al carrito");
});

dom.addByCodeBtn?.addEventListener("click", () => {
  const code = dom.quickCode?.value || "";
  const qty = toNumber(dom.quickQty?.value, 1) || 1;
  const found = findProductByAnyCode(code);
  if (!found) {
    toast("Código no encontrado");
    return;
  }
  const selectionId = found.type === "variant" ? `VAR:${found.variant.id}` : found.product.id;
  const ok = addToCart(selectionId, qty);
  if (ok) {
    dom.quickProduct.value = selectionId;
    dom.quickCode.value = "";
    if (found.type === "variant") {
      const product = findProductById(found.variant.productId);
      toast(`Agregado por código: ${productDisplayName(product)} [${variantLabel(found.variant)}]`);
    } else {
      toast(`Agregado por código: ${productDisplayName(found.product)}`);
    }
  }
});

dom.quickCode?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();
  dom.addByCodeBtn?.click();
});

dom.clearCartBtn.addEventListener("click", () => {
  state.cart = [];
  markDirty();
  renderCart();
});

dom.paymentMethod.addEventListener("change", renderCart);
dom.amountPaid.addEventListener("input", renderCart);

dom.checkoutBtn.addEventListener("click", async () => {
  await runWithAppLoading(async () => {
  if (!state.cart.length) {
    toast("El carrito esta vacio");
    return;
  }
  const method = dom.paymentMethod.value;
  const total = cartTotal();
  const paid = method === "transferencia" ? total : toNumber(dom.amountPaid.value);
  const customerName = (dom.customerName?.value || "").trim();
  const selectedCustomerName = (dom.customerNameSelect?.value || "").trim();
  const finalCustomerName = selectedCustomerName || customerName;
  const customerRef = getCustomerByName(finalCustomerName);
  const fiadoInterestPct = toNumber(dom.fiadoInterestPct?.value, 0);
  const fiadoPaidMethod = dom.fiadoPaymentMethod?.value || "efectivo";
  if (method === "efectivo" && paid < total) {
    toast("En efectivo, el monto pagado debe cubrir el total");
    return;
  }
  if (method === "fiado" && !finalCustomerName) {
    toast("Completa el nombre del cliente para la libreta");
    return;
  }
  if (method === "fiado" && customerRef) {
    const projected = computeCustomerBalance(finalCustomerName) + Math.max(0, total - paid);
    const creditLimit = toNumber(customerRef.creditLimit, 0);
    if (creditLimit > 0 && projected > creditLimit + 0.009) {
      toast(`El saldo supera el límite de fiado (${creditLimit.toFixed(2)})`);
      return;
    }
  }
  if (method === "fiado" && (paid < 0 || paid > total)) {
    toast("La seña debe estar entre 0 y el total de la venta");
    return;
  }
  for (const item of state.cart) {
    const p = findProductById(item.productId);
    if (!p) {
      toast("Hay productos invalidos en el carrito");
      return;
    }
    const qty = toNumber(item.qty);
    if (item.variantId) {
      const variant = findVariantById(item.variantId);
      if (!variant || toNumber(variant.stock) < qty) {
        toast(`Stock insuficiente en variante: ${productDisplayName(p)}`);
        return;
      }
    } else if (toNumber(p.stock) < qty) {
      toast(`Stock insuficiente: ${productDisplayName(p)}`);
      return;
    }
  }
  const saleItems = [];
  for (const item of state.cart) {
    const p = findProductById(item.productId);
    if (!p) continue;
    const qty = toNumber(item.qty);
    const variant = item.variantId ? findVariantById(item.variantId) : null;
    if (variant) {
      if (toNumber(variant.stock) < qty) return;
      variant.stock = toNumber(variant.stock) - qty;
      variant.updatedAt = new Date().toISOString();
      state.history.push({
        id: uid(),
        date: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productId: item.productId,
        productName: `${productDisplayName(p)} [${variantLabel(variant)}]`,
        type: "salida",
        qty,
      });
    } else {
      const ok = registerMovement(item.productId, "salida", qty);
      if (!ok) return;
    }
    const unitPrice = resolveCartUnitPrice(item);
    saleItems.push({
      productId: p.id,
      variantId: item.variantId || "",
      name: `${productDisplayName(p)}${variant ? ` [${variantLabel(variant)}]` : ""}`,
      qty,
      price: toNumber(unitPrice),
      subtotal: toNumber(unitPrice) * qty,
    });
  }
  const status = paymentStatus(total, paid, method);
  const collectedAmount = method === "efectivo" ? Math.min(paid, total) : paid;
  const finalTotal = method === "fiado" ? Number((total * (1 + fiadoInterestPct / 100)).toFixed(2)) : Number(total.toFixed(2));
  const pending = method === "fiado" ? Math.max(0, finalTotal - paid) : Math.max(0, total - paid);
  const change = Math.max(0, paid - total);
  const sale = {
    id: `V-${Date.now()}`,
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    method,
    total: Number(total.toFixed(2)),
    finalTotal,
    paid: Number(paid.toFixed(2)),
    pending: Number(pending.toFixed(2)),
    change: Number(change.toFixed(2)),
    items: saleItems,
    customerName: method === "fiado" ? finalCustomerName : "",
  };
  state.sales.push(sale);
  if (method === "fiado") {
    if (!customerRef) {
      state.customers.push(
        normalizeCustomer({
          id: uid(),
          name: finalCustomerName,
          phone: "",
          creditLimit: 0,
          balance: 0,
          notes: "",
          updatedAt: new Date().toISOString(),
        })
      );
    }
    state.debts.push({
      id: uid(),
      saleId: sale.id,
      date: sale.date,
      updatedAt: sale.date,
      customerName: finalCustomerName,
      customerId: customerRef?.id || "",
      date: sale.date,
      subtotal: sale.total,
      interestPct: fiadoInterestPct,
      total: sale.finalTotal,
      pending: sale.pending,
      paidAmount: sale.paid,
      paid: sale.pending <= 0,
      items: saleItems,
      payments:
        sale.paid > 0
          ? [{ id: uid(), date: sale.date, amount: sale.paid, method: fiadoPaidMethod, note: "Seña inicial" }]
          : [],
    });
  }
  state.history.push({
    id: uid(),
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    productId: "VENTA",
    productName: `Cobro carrito (${method})`,
    type: "cobro",
    qty: Number(collectedAmount.toFixed(2)),
    note: status,
  });
  state.cart = [];
  dom.amountPaid.value = "0";
  if (dom.customerName) dom.customerName.value = "";
  if (dom.customerNameSelect) dom.customerNameSelect.value = "";
  markDirty();
  saveLocal();
  renderAll();
  toast("Venta cobrada");
  printTicket(sale);
  try {
    await flushSync();
  } catch (_) {}
  }, "Procesando venta...");
});

dom.registerMoveBtn.addEventListener("click", async () => {
  await runWithAppLoading(async () => {
  if (String(dom.moveProduct.value || "").startsWith("VAR:")) {
    toast("Para variantes ajusta stock desde catálogo inteligente");
    return;
  }
  const ok = registerMovement(dom.moveProduct.value, dom.moveType.value, dom.moveQty.value);
  if (!ok) return;
  dom.moveQty.value = "";
  markDirty();
  saveLocal();
  renderAll();
  toast("Movimiento registrado");
  try {
    await flushSync();
  } catch (_) {}
  }, "Registrando movimiento...");
});

dom.countProduct?.addEventListener("change", () => updateRecountHint());
dom.countQty?.addEventListener("input", () => updateRecountHint());
dom.applyRecountBtn?.addEventListener("click", async () => {
  await runWithAppLoading(async () => {
    const productId = dom.countProduct?.value || "";
    if (!productId) {
      toast("Elegí un producto");
      return;
    }
    const ok = registerRecuento(productId, dom.countQty?.value);
    if (!ok) return;
    if (dom.countQty) dom.countQty.value = "";
    markDirty();
    saveLocal();
    renderAll();
    toast("Recuento aplicado · quedó en el historial");
    try {
      await flushSync();
    } catch (_) {}
  }, "Aplicando recuento...");
});

dom.exportCsvBtn.addEventListener("click", exportHistoryCsv);
dom.toggleProductListBtn?.addEventListener("click", () => {
  const willOpen = !ui.productListOpen;
  if (willOpen) {
    ui.catalogListPinnedOpen = true;
    ui.catalogListForcedClosed = false;
    ui.productListOpen = true;
  } else {
    ui.catalogListPinnedOpen = false;
    ui.productListOpen = false;
    const filtering =
      String(state.filterText || "").trim().length > 0 || Boolean(state.filterCategory);
    ui.catalogListForcedClosed = filtering;
  }
  try {
    localStorage.setItem(PRODUCT_LIST_OPEN_KEY, ui.catalogListPinnedOpen ? "1" : "0");
  } catch (_) {}
  applyProductListPanel();
});

dom.toggleHistoryBtn?.addEventListener("click", () => {
  ui.historyOpen = !ui.historyOpen;
  if (dom.historyPanel) {
    dom.historyPanel.classList.toggle("hidden", !ui.historyOpen);
  }
  if (dom.toggleHistoryBtn) {
    dom.toggleHistoryBtn.textContent = ui.historyOpen
      ? "Ocultar historial de movimientos"
      : "Consultar historial de movimientos";
  }
  if (ui.historyOpen) renderHistory();
});

dom.syncBtn.addEventListener("click", async () => {
  await runWithAppLoading(async () => {
    await flushSync(true);
  }, "Sincronizando...");
});

window.addEventListener("online", () => {
  updateSyncStatus();
  flushSync().catch(() => {});
});

window.addEventListener("offline", () => {
  updateSyncStatus();
});

function setupPwa() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

function init() {
  initTheme();
  try {
    const savedView = localStorage.getItem(VIEW_KEY);
    if (savedView) ui.currentView = savedView;
  } catch (_) {}
  initFirebase();
  loadLocal();
  try {
    ui.catalogListPinnedOpen = localStorage.getItem(PRODUCT_LIST_OPEN_KEY) === "1";
  } catch (_) {
    ui.catalogListPinnedOpen = false;
  }
  ui.catalogListForcedClosed = false;
  ui.productListOpen = ui.catalogListPinnedOpen;
  renderAll();
  setupPwa();
  updateSyncStatus();
  flushSync().catch(() => {
    if (!cloud.enabled) {
      toast("Configura firebase-config.js para activar nube");
    }
  });
  setInterval(() => {
    if (!navigator.onLine || !cloud.enabled) return;
    if (state.meta.dirty) {
      flushSync().catch(() => {});
      return;
    }
    // Verificación de respaldo cada 10s para reflejar cambios remotos.
    syncFromServer().catch(() => {});
  }, SYNC_INTERVAL_MS);
}

init();
