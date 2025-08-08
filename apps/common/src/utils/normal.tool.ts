import * as Lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isLeapYear from 'dayjs/plugin/isLeapYear';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear); // 使用插件
dayjs.locale('zh-cn'); // 使用本地化语言
dayjs.tz.setDefault('Asia/Beijing');

// 定义树节点的接口
interface TreeNode {
  id: string | number;
  label: string;
  parentId: string | number | null;
  children: TreeNode[];
}

// 定义输入项的接口
interface ListItem {
  parentId: string | number | null;
  [key: string]: any;
}

// 定义分页数据项的接口
// interface PageItem {
//   ipaddr?: string;
//   username?: string;
//   [key: string]: any;
// }

// 定义分页参数接口
// interface PaginationData {
//   list: PageItem[];
//   pageSize: number;
//   current: number;
// }

// // 定义过滤参数接口
// interface FilterParam {
//   ipaddr?: string;
//   userName?: string;
//   [key: string]: any;
// }

/**
 * 数组转树结构
 * @param arr 输入数组
 * @param getId 获取ID的函数
 * @param getLabel 获取标签的函数
 * @returns 树形结构数组
 *
 * @example
 * ```typescript
 * // 示例数据
 * const data = [
 *   { id: 1, name: '部门A', parentId: null },
 *   { id: 2, name: '部门B', parentId: 1 },
 *   { id: 3, name: '部门C', parentId: 1 },
 *   { id: 4, name: '部门D', parentId: 2 },
 *   { id: 5, name: '部门E', parentId: null }
 * ];
 *
 * // 转换为树形结构
 * const tree = ListToTree(
 *   data,
 *   (item) => item.id,
 *   (item) => item.name
 * );
 *
 * // 输出结果:
 * // [
 * //   {
 * //     id: 1,
 * //     label: '部门A',
 * //     parentId: null,
 * //     children: [
 * //       {
 * //         id: 2,
 * //         label: '部门B',
 * //         parentId: 1,
 * //         children: [
 * //           {
 * //             id: 4,
 * //             label: '部门D',
 * //             parentId: 2,
 * //             children: []
 * //           }
 * //         ]
 * //       },
 * //       {
 * //         id: 3,
 * //         label: '部门C',
 * //         parentId: 1,
 * //         children: []
 * //       }
 * //     ]
 * //   },
 * //   {
 * //     id: 5,
 * //     label: '部门E',
 * //     parentId: null,
 * //     children: []
 * //   }
 * // ]
 * ```
 */
export function ListToTree<T extends ListItem>(
  arr: T[],
  getId: (item: T) => string | number,
  getLabel: (item: T) => string,
): TreeNode[] {
  const tree: TreeNode[] = []; // 最终的树形结构数组
  const map: Record<string | number, TreeNode> = {}; // 以id为键的对象，用于快速查找节点

  // 首先初始化map，并创建节点对象
  arr.forEach((item) => {
    const node: TreeNode = {
      id: getId(item),
      label: getLabel(item),
      parentId: item.parentId,
      children: [],
    };
    map[node.id] = node;
  });

  // 然后根据parentId构建树形结构
  Object.values(map).forEach((node) => {
    if (node.parentId === 0 || node.parentId === null || !map[node.parentId]) {
      // 如果parentId为0，或者parentId不存在于map中，则视为根节点
      tree.push(node);
    } else {
      // 否则，将该节点添加到其父节点的children数组中
      if (!map[node.parentId].children) {
        map[node.parentId].children = [];
      }
      map[node.parentId].children.push(node);
    }
  });

  return tree;
}

/**
 * 获取当前时间
 * YYYY-MM-DD HH:mm:ss
 * @returns
 */
export function GetNowDate() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 时间格式化
 * @param date
 * @param format
 * @returns
 */
export function FormatDate(date: Date, format = 'YYYY-MM-DD HH:mm:ss') {
  return date && dayjs(date).format(format);
}

/**
 * 深拷贝
 * @param obj
 * @returns
 */
export function DeepClone(obj: object) {
  return Lodash.cloneDeep(obj);
}

/**
 * 生成唯一id
 * UUID
 * @returns
 */
export function GenerateUUID(): string {
  const uuid = uuidv4();
  return uuid.replaceAll('-', '');
}

/**
 * 数组去重
 * @param list
 * @returns
 */
export function Uniq(list: Array<number | string>) {
  return Lodash.uniq(list);
}

/**
 * 分页函数
 * @param data 分页数据对象，包含列表、页大小和当前页
 * @param filterParam 过滤参数对象
 * @returns 过滤后的分页数据数组
 *
 * @example
 * ```typescript
 * // 示例数据
 * const data = {
 *   list: [
 *     { id: 1, username: 'user1', ipaddr: '192.168.1.1', status: 'active' },
 *     { id: 2, username: 'user2', ipaddr: '192.168.1.2', status: 'inactive' },
 *     { id: 3, username: 'admin', ipaddr: '192.168.1.3', status: 'active' },
 *     { id: 4, username: 'user4', ipaddr: '192.168.1.4', status: 'active' },
 *     { id: 5, username: 'user5', ipaddr: '192.168.1.5', status: 'inactive' }
 *   ],
 *   pageSize: 2,
 *   current: 1
 * };
 *
 * // 不带过滤条件的分页
 * const result1 = Paginate(data, {});
 * // 返回: [{ id: 1, username: 'user1', ipaddr: '192.168.1.1', status: 'active' },
 * //        { id: 2, username: 'user2', ipaddr: '192.168.1.2', status: 'inactive' }]
 *
 * // 按IP地址过滤
 * const result2 = Paginate(data, { ipaddr: '192.168.1' });
 * // 返回所有包含 '192.168.1' 的记录
 *
 * // 按用户名过滤
 * const result3 = Paginate(data, { userName: 'user' });
 * // 返回所有用户名包含 'user' 的记录
 *
 * // 组合过滤
 * const result4 = Paginate(data, { ipaddr: '192.168.1', userName: 'user' });
 * // 返回同时满足IP和用户名条件的记录
 * ```
 */
// export function Paginate(
//   data: PaginationData,
//   filterParam: FilterParam,
// ): PageItem[] {
//   // 检查 pageSize 和 currentber 的合法性
//   if (data.pageSize <= 0 || data.current < 0) {
//     return [];
//   }

//   // 将数据转换为数组
//   let arrayData: PageItem[] = Lodash.toArray(data.list);

//   if (Object.keys(filterParam).length > 0) {
//     arrayData = Lodash.filter(arrayData, (item: PageItem) => {
//       const arr: boolean[] = [];
//       if (filterParam.ipaddr && item.ipaddr) {
//         arr.push(Boolean(item.ipaddr.includes(filterParam.ipaddr)));
//       }

//       if (filterParam.userName && item.username) {
//         arr.push(Boolean(item.username.includes(filterParam.userName)));
//       }
//       return !arr.includes(false);
//     });
//   }

//   // 获取指定页的数据
//   const pageData = arrayData.slice(
//     (data.current - 1) * data.pageSize,
//     data.current * data.pageSize,
//   );

//   return pageData;
// }
