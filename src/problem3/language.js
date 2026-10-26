export const LANGUAGE = {
  en: {
    title: "Messy React",
    codeTitle: "Refactored component",
    lead: "The snippet crashes, keeps the wrong balances, and sorts again whenever prices change.",
    language: "Language",
    issuesLabel: "Issues",
    codeLabel: "Code",
    originalTab: "Original",
    refactoredTab: "Refactored",
    issues: [
      {
        title: "The filter reads lhsPriority, which does not exist",
        problem:
          "getPriority stores its result in balancePriority, then the condition uses lhsPriority. That name is not in scope, so the memo throws a ReferenceError and the page never renders.",
        fix: "Compare balancePriority, or the priority field computed once per row.",
      },
      {
        title: "The amount check keeps empty balances",
        problem:
          "After the variable name is fixed, amount <= 0 returns true. Known chains with a zero or negative amount stay in the list, and every positive balance is removed.",
        fix: "Keep a row only when its priority is above -99 and its amount is greater than 0.",
      },
      {
        title: "formattedBalances is unused, so the rows have no formatted amount",
        problem:
          "The first map builds formatted, then rows maps sortedBalances instead. Those objects have no formatted field. Annotating the callback as FormattedWalletBalance hides that mismatch, and formattedAmount is undefined. The extra map is also wasted work.",
        fix: "Map the formatted rows once and pass that array to WalletRow.",
      },
      {
        title: "classes is not defined",
        problem: "className={classes.row} reads a binding that does not exist, so rendering a row throws.",
        fix: "Import the stylesheet binding, or pass a class name that exists.",
      },
      {
        title: "WalletBalance has no blockchain",
        problem:
          "The component reads balance.blockchain, but the interface only declares currency and amount. FormattedWalletBalance copies those two fields instead of extending WalletBalance, and it still has no blockchain. The snippet does not type-check.",
        fix: "Add blockchain to WalletBalance and extend that interface for the formatted row.",
      },
      {
        title: "The comparator is incomplete and repeats getPriority",
        problem:
          "When two priorities are equal the sort function returns undefined instead of 0. getPriority also runs once per filtered row and twice per comparison, so a value that depends only on the chain is recalculated through the whole sort.",
        fix: "Store priority on each balance, then sort with right.priority - left.priority.",
      },
      {
        title: "useMemo reruns the sort when prices change",
        problem:
          "prices is in the dependency array, but the memo never reads prices. Every price update filters and sorts again. getPriority is also created inside the component on every render even though it closes over nothing.",
        fix: "Move getPriority to module scope. Memoize the sort on balances only, and memoize USD values separately on prices.",
      },
      {
        title: "Row keys are array indexes",
        problem:
          "key={index} identifies a position, not a balance. The list is sorted, so a reorder reuses the wrong WalletRow and can mix up state inside that row.",
        fix: "Key by blockchain and currency. The same currency can exist on more than one chain.",
      },
      {
        title: "children is dropped, and Box props are spread onto a div",
        problem:
          "children is destructured and never rendered, so anything passed inside WalletPage disappears. Props extends an empty BoxProps, and ...rest can still carry non-DOM props such as sx onto a div.",
        fix: "Render children. Type the wrapper as DOM attributes, or render a real Box if these are MUI system props.",
      },
      {
        title: "A missing price becomes NaN, and toFixed() rounds away the fraction",
        problem:
          'prices[balance.currency] is undefined for an unknown currency, and undefined multiplied by an amount is NaN. amount.toFixed() with no digits rounds 1.29 to "1".',
        fix: "Default a missing price to 0 and format with an explicit fraction, such as toFixed(2).",
      },
      {
        title: "any and React.FC hide the real props",
        problem:
          "blockchain: any turns off checking of the chain name. React.FC adds nothing once the props are typed, and it used to imply children even when the component did not render them.",
        fix: "Type blockchain as string and export a plain function component.",
      },
      {
        title: "The hooks have no empty fallback",
        problem:
          "If useWalletBalances() or usePrices() is still undefined while loading, calling filter or indexing prices throws.",
        fix: "Default balances to [] and prices to {}.",
      },
    ],
  },
  vi: {
    title: "Messy React",
    codeTitle: "Component đã refactor",
    lead: "Đoạn code bị crash, giữ số dư sai, và sort lại mỗi khi giá thay đổi.",
    language: "Ngôn ngữ",
    issuesLabel: "Danh sách lỗi",
    codeLabel: "Code",
    originalTab: "Code ban đầu",
    refactoredTab: "Đã refactor",
    issues: [
      {
        title: "Filter đọc lhsPriority, biến này không tồn tại",
        problem:
          "getPriority gán kết quả vào balancePriority, nhưng điều kiện lại dùng lhsPriority. Tên này không nằm trong scope, nên memo ném ReferenceError và trang không render.",
        fix: "So sánh balancePriority, hoặc field priority đã tính một lần cho mỗi dòng.",
      },
      {
        title: "Điều kiện amount giữ lại số dư rỗng",
        problem:
          "Sau khi sửa tên biến, amount <= 0 trả về true. Chain đã biết với số dư bằng 0 hoặc âm vẫn ở trong list, mọi số dư dương bị loại.",
        fix: "Chỉ giữ dòng có priority lớn hơn -99 và amount lớn hơn 0.",
      },
      {
        title: "formattedBalances không được dùng, nên dòng không có số đã format",
        problem:
          "Map đầu tạo formatted, nhưng rows lại map sortedBalances. Các object đó không có field formatted. Annotation FormattedWalletBalance che mất lệch kiểu, formattedAmount là undefined. Map thừa cũng tốn công.",
        fix: "Map các dòng đã format một lần và truyền mảng đó vào WalletRow.",
      },
      {
        title: "classes không được khai báo",
        problem: "className={classes.row} đọc một binding không tồn tại, nên render một dòng sẽ throw.",
        fix: "Import binding của stylesheet, hoặc truyền tên class có thật.",
      },
      {
        title: "WalletBalance không có blockchain",
        problem:
          "Component đọc balance.blockchain, nhưng interface chỉ khai báo currency và amount. FormattedWalletBalance copy hai field đó thay vì extends WalletBalance, và vẫn không có blockchain. Đoạn này không type-check.",
        fix: "Thêm blockchain vào WalletBalance và cho dòng đã format extends interface đó.",
      },
      {
        title: "Comparator chưa đủ và gọi getPriority lặp lại",
        problem:
          "Hai priority bằng nhau thì hàm sort trả undefined thay vì 0. getPriority chạy một lần mỗi dòng được lọc và hai lần mỗi lần so sánh, dù giá trị chỉ phụ thuộc chain.",
        fix: "Gắn priority vào mỗi balance, rồi sort bằng right.priority - left.priority.",
      },
      {
        title: "useMemo sort lại khi prices đổi",
        problem:
          "prices nằm trong dependency nhưng memo không đọc prices. Mỗi lần giá đổi, filter và sort chạy lại. getPriority cũng được tạo trong component mỗi lần render dù không đóng over gì.",
        fix: "Đưa getPriority ra module scope. Memo phần sort chỉ theo balances, và memo giá trị USD riêng theo prices.",
      },
      {
        title: "Key của dòng là index",
        problem:
          "key={index} nhận diện vị trí, không phải balance. List bị sort, nên đổi thứ tự sẽ tái sử dụng sai WalletRow và có thể lẫn state bên trong dòng đó.",
        fix: "Key theo blockchain và currency. Cùng một currency có thể có trên nhiều chain.",
      },
      {
        title: "children bị bỏ, và prop của Box bị trải lên div",
        problem:
          "children được destructure nhưng không render, nên nội dung truyền vào WalletPage biến mất. Props extends BoxProps rỗng, và ...rest vẫn có thể mang prop không thuộc DOM như sx lên div.",
        fix: "Render children. Kiểu của wrapper là attribute của DOM, hoặc render Box thật nếu đây là system prop của MUI.",
      },
      {
        title: "Giá thiếu thành NaN, và toFixed() làm mất phần thập phân",
        problem:
          'prices[balance.currency] là undefined với currency lạ, undefined nhân amount ra NaN. amount.toFixed() không truyền số chữ số sẽ làm 1.29 thành "1".',
        fix: "Giá thiếu mặc định là 0 và format với số chữ số rõ ràng, ví dụ toFixed(2).",
      },
      {
        title: "any và React.FC che kiểu thật",
        problem:
          "blockchain: any tắt kiểm tra tên chain. React.FC không thêm gì khi props đã có kiểu, và trước đây nó ngầm có children dù component không render children.",
        fix: "Kiểu blockchain là string và export một function component thường.",
      },
      {
        title: "Hai hook không có giá trị rỗng",
        problem:
          "Nếu useWalletBalances() hoặc usePrices() còn undefined lúc đang tải, gọi filter hoặc đọc prices sẽ throw.",
        fix: "Mặc định balances là [] và prices là {}.",
      },
    ],
  },
};
