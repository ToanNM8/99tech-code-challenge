export interface IssueCopy {
  title: string;
  problem: string;
  fix: string;
}

export interface LanguageCopy {
  title: string;
  codeTitle: string;
  lead: string;
  language: string;
  issuesLabel: string;
  codeLabel: string;
  originalTab: string;
  refactoredTab: string;
  issues: IssueCopy[];
}

export const LANGUAGE: Record<"en" | "vi", LanguageCopy> = {
  en: {
    title: "Messy React",
    codeTitle: "Refactored component",
    lead: "Read the original code from top to bottom. The number in parentheses is how many lines have that same issue. Click again to jump to the next one.",
    language: "Language",
    issuesLabel: "Issues",
    codeLabel: "Code",
    originalTab: "Original",
    refactoredTab: "Refactored",
    issues: [
      {
        title: "The type forgets blockchain",
        problem:
          "The code uses balance.blockchain, but WalletBalance only has currency and amount. FormattedWalletBalance copies those two fields and still has no blockchain, so TypeScript cannot check it.",
        fix: "Add blockchain to WalletBalance, and make FormattedWalletBalance extend it.",
      },
      {
        title: "children is removed, and Box props land on a div",
        problem:
          "children is taken out of props and never shown, so anything wrapped by this component disappears. The rest of the props can include Box values such as sx, which a plain div does not understand.",
        fix: "Render children. Use a Box if these are MUI props, or only accept normal div attributes.",
      },
      {
        title: "any and React.FC hide the real types",
        problem:
          "blockchain: any stops TypeScript from checking the chain name. React.FC does not add anything once the props already have a type.",
        fix: "Type blockchain as string, and write a normal function component.",
      },
      {
        title: "The hooks can still be empty while loading",
        problem:
          "useWalletBalances() and usePrices() are used straight away. If either one is still undefined, filter throws and the price lookup throws.",
        fix: "Treat a missing balance list as [] and a missing price map as {}.",
      },
      {
        title: "Prices make the list sort again",
        problem:
          "getPriority is created again on every render, and prices is listed as a dependency even though this memo never reads prices. Every price update filters and sorts the whole list.",
        fix: "Move getPriority outside the component. Sort only when balances change, and calculate USD values in a separate step.",
      },
      {
        title: "Sorting repeats work and skips equal priorities",
        problem:
          "getPriority runs again on every comparison. When two chains have the same priority, the function returns nothing instead of 0, so the order is not explicit.",
        fix: "Store priority on each row once, then sort with right.priority - left.priority.",
      },
      {
        title: "lhsPriority does not exist",
        problem:
          "The filter saves the priority in balancePriority, then checks lhsPriority. That name was never declared, so the page crashes before it can render.",
        fix: "Check balancePriority, the variable that was just calculated.",
      },
      {
        title: "Empty balances are kept",
        problem:
          "amount <= 0 returns true. Zero and negative amounts stay in the list, and every positive amount is removed.",
        fix: "Keep a row only when the chain is known and the amount is greater than 0.",
      },
      {
        title: "formattedBalances is built, then ignored",
        problem:
          "The first map adds formatted. The rows are then built from sortedBalances, which has no formatted field, so formattedAmount is undefined. The extra map does no useful work.",
        fix: "Format the rows once, and render that array.",
      },
      {
        title: "A missing price becomes NaN, and the cents are dropped",
        problem:
          "An unknown currency has no price, and undefined times an amount is NaN. toFixed() with no digits turns 1.29 into \"1\".",
        fix: "Use 0 when the price is missing, and format the amount with toFixed(2).",
      },
      {
        title: "classes was never created",
        problem: "className={classes.row} reads a variable that does not exist, so drawing a row throws.",
        fix: "Pass a class name that exists, or import the stylesheet that defines it.",
      },
      {
        title: "The row key is just its position",
        problem:
          "key={index} names the slot, not the balance. After the list is sorted, React can reuse the wrong row and mix up its state.",
        fix: "Use a key made from blockchain and currency. The same currency can exist on more than one chain.",
      },
    ],
  },
  vi: {
    title: "Messy React",
    codeTitle: "Component đã refactor",
    lead: "Đọc code gốc từ trên xuống. Số trong ngoặc là số dòng bị cùng lỗi đó. Bấm tiếp để nhảy sang dòng kế tiếp.",
    language: "Ngôn ngữ",
    issuesLabel: "Danh sách lỗi",
    codeLabel: "Code",
    originalTab: "Code ban đầu",
    refactoredTab: "Đã refactor",
    issues: [
      {
        title: "Kiểu dữ liệu thiếu blockchain",
        problem:
          "Code dùng balance.blockchain, nhưng WalletBalance chỉ có currency và amount. FormattedWalletBalance chép lại hai field đó và vẫn không có blockchain, nên TypeScript không kiểm tra được.",
        fix: "Thêm blockchain vào WalletBalance, và cho FormattedWalletBalance kế thừa nó.",
      },
      {
        title: "children bị bỏ, prop của Box bị đưa vào div",
        problem:
          "children bị tách ra khỏi props nhưng không được render, nên nội dung bọc bên trong biến mất. Phần props còn lại có thể chứa giá trị của Box như sx, mà div thường không hiểu.",
        fix: "Render children. Dùng Box nếu đây là prop của MUI, hoặc chỉ nhận attribute bình thường của div.",
      },
      {
        title: "any và React.FC che mất kiểu thật",
        problem:
          "blockchain: any làm TypeScript không kiểm tra tên chain. React.FC không thêm gì khi props đã có kiểu.",
        fix: "Kiểu của blockchain là string, và viết một function component bình thường.",
      },
      {
        title: "Hai hook có thể còn rỗng lúc đang tải",
        problem:
          "useWalletBalances() và usePrices() bị dùng ngay. Nếu một trong hai còn undefined, filter và việc đọc giá sẽ throw.",
        fix: "Coi danh sách số dư thiếu là [], và bảng giá thiếu là {}.",
      },
      {
        title: "Giá thay đổi làm danh sách bị sort lại",
        problem:
          "getPriority được tạo lại mỗi lần render, và prices nằm trong dependency dù memo này không đọc prices. Mỗi lần giá đổi, cả danh sách bị filter và sort lại.",
        fix: "Đưa getPriority ra ngoài component. Chỉ sort khi balances đổi, và tính USD ở một bước riêng.",
      },
      {
        title: "Sort làm lại việc thừa và bỏ qua priority bằng nhau",
        problem:
          "getPriority chạy lại ở mỗi lần so sánh. Hai chain cùng priority thì hàm không trả 0, nên thứ tự không được nói rõ.",
        fix: "Gắn priority vào mỗi dòng một lần, rồi sort bằng right.priority - left.priority.",
      },
      {
        title: "lhsPriority không tồn tại",
        problem:
          "Filter lưu priority vào balancePriority, rồi lại kiểm tra lhsPriority. Tên đó chưa được khai báo, nên trang crash trước khi render.",
        fix: "Kiểm tra balancePriority, biến vừa được tính.",
      },
      {
        title: "Số dư rỗng vẫn được giữ lại",
        problem:
          "amount <= 0 trả về true. Số dư bằng 0 hoặc âm ở lại trong danh sách, còn mọi số dư dương bị loại.",
        fix: "Chỉ giữ dòng khi chain đã biết và amount lớn hơn 0.",
      },
      {
        title: "formattedBalances được tạo rồi bị bỏ",
        problem:
          "Map đầu thêm formatted. Các dòng sau lại lấy từ sortedBalances, object không có field formatted, nên formattedAmount là undefined. Map thừa không có ích.",
        fix: "Format các dòng một lần, rồi render đúng mảng đó.",
      },
      {
        title: "Giá thiếu thành NaN, và phần lẻ bị cắt",
        problem:
          "Currency lạ không có giá, undefined nhân với amount ra NaN. toFixed() không truyền số chữ số sẽ biến 1.29 thành \"1\".",
        fix: "Giá thiếu thì dùng 0, và format amount bằng toFixed(2).",
      },
      {
        title: "classes chưa được tạo",
        problem: "className={classes.row} đọc một biến không tồn tại, nên vẽ một dòng sẽ throw.",
        fix: "Truyền tên class có thật, hoặc import stylesheet định nghĩa class đó.",
      },
      {
        title: "Key của dòng chỉ là vị trí",
        problem:
          "key={index} đặt tên cho vị trí, không phải cho số dư. Sau khi sort, React có thể dùng lại sai dòng và lẫn state của dòng đó.",
        fix: "Key gồm blockchain và currency. Cùng một currency có thể có trên nhiều chain.",
      },
    ],
  },
};
