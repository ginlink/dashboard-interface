import { deepEqual, isType, shallowEqualArr } from './shallowEqual'

describe('multicall reducer', () => {
  const obj1 = {}
  const obj2 = {}

  const obj3 = { obj1: { obj2: 123 } }
  const obj4 = { obj1: { obj2: 123 } }

  const obj5 = { obj1: { obj2: { obj3: 111 } } }
  const obj6 = { obj1: { obj2: { obj3: 123 } } }

  const obj7 = { key1: 123 }
  const obj8 = { key2: 123 }

  const person = {
    userName: '胡帅',
    wife: { userName: '赵铁锤', age: 28 },
    sons: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons1: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons2: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons3: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons4: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons5: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons6: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons7: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons8: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons9: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons10: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons11: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons12: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons13: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons14: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons15: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons16: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons17: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons18: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons19: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
  }
  const person1 = {
    userName: '胡帅',
    wife: { userName: '赵铁锤', age: 28 },
    sons: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons1: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons2: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons3: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons4: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons5: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons6: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons7: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons8: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons9: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons10: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons11: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons12: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons13: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons14: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons15: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons16: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons17: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons18: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
    sons19: [{ userName: '狗蛋儿' }, { userName: '二狗蛋' }, { userName: '小狗蛋' }],
  }

  // 60个项目，10层，每个项目100个元素，耗时57毫秒
  // 60个项目，10层，每个项目1000个元素，耗时574毫秒
  // 60个项目，10层，每个项目10000个元素，耗时5958毫秒
  // 如果指定深度，则耗时会大大减小
  // 一般一个对象项目不会超过100个，深度3层，项目元素100，耗时27毫秒
  const autoObj1 = getObj(100, 3, 100)
  const autoObj2 = getObj(100, 3, 100)

  // console.log('[]:', getObj(7, 1, 100))

  it('边界条件', () => {
    expect(deepEqual(undefined, undefined)).toEqual(true)
    expect(deepEqual(null, null)).toEqual(true)
  })

  it('基本深层比较', () => {
    // 如果不传入depth（深度），则默认无限深度
    expect(deepEqual(obj1, obj2)).toEqual(true)

    console.time('基本深层比较')
    expect(deepEqual(obj3, obj4)).toEqual(true)
    console.timeEnd('基本深层比较')

    expect(deepEqual(obj5, obj6)).toEqual(false)

    console.time('基本深层person')
    expect(deepEqual(person, person1)).toEqual(true)
    console.timeEnd('基本深层person')

    console.time('基本深层autoObj1')
    expect(deepEqual(autoObj1, autoObj2)).toEqual(true)
    console.timeEnd('基本深层autoObj1')
  })

  it('比较层数', () => {
    console.time('比较层数1')
    expect(deepEqual(obj5, obj6, 1)).toEqual(true)
    console.timeEnd('比较层数1')

    console.time('比较层数2')
    expect(deepEqual(obj5, obj6, 2)).toEqual(true)
    console.timeEnd('比较层数2')

    console.time('比较层数3')
    expect(deepEqual(obj5, obj6)).toEqual(false)
    console.timeEnd('比较层数3')

    console.time('比较层数person')
    expect(deepEqual(person, person1, 3)).toEqual(true)
    console.timeEnd('比较层数person')
  })

  it('比较两个key是否相同', () => {
    expect(deepEqual(obj7, obj8)).toEqual(false)
  })

  it('isType equal test', () => {
    expect(isType(undefined, 'undefined')).toEqual(true)
    expect(isType(null, 'null')).toEqual(true)
    expect(isType(123, 'number')).toEqual(true)
    expect(isType('', 'string')).toEqual(true)
    expect(isType({}, 'object')).toEqual(true)
    expect(isType([], 'array')).toEqual(true)
    expect(isType(/1/, 'regexp')).toEqual(true)
  })
})

/**
 * 生成指定个数，深度，元素个数的对象
 * @param num
 * @param maxDepth
 * @param count 元素个数
 * @returns
 */
function getObj(num: number, maxDepth: number, count: number) {
  const totalRes: Record<string, any> = {}

  const rec = (res: Record<string, any>, depth: number, index: number) => {
    if (depth >= maxDepth) return

    const depthKey = 'depth' + index + depth
    const nextDepthKey = 'depth' + index + (depth + 1)

    const currentRes: Record<string, any> = {}
    for (let i = 0; i < count; ++i) {
      currentRes['param' + depth + i] = '123'
    }

    res[depthKey] = currentRes

    res[depthKey][nextDepthKey] = {} as Record<string, any>
    rec(res[depthKey][nextDepthKey], depth + 1, index)

    if (depth == maxDepth - 1) {
      delete res[depthKey][nextDepthKey]
    }
  }

  for (let i = 0; i < num; ++i) {
    rec(totalRes, 0, i)
  }

  return totalRes
}
