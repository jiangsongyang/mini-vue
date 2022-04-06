const queue = [];

const p = Promise.resolve();

let isFlushPending = false;

// 如果用户传入 functoin
// 就在下一圈微任务中执行
// 否则返回一个 promise
// 占用一个时序
// 来保证更新的进行顺序
export function nextTick(fn) {
  return fn ? p.then(fn) : p;
}

export function queueJobs(job) {
  // 如果当前的任务已经被推进来了
  // 就不需要重复进行添加了
  if (!queue.includes(job)) {
    queue.push(job);
  }
  // 冲刷队列
  queueFlush();
}

function queueFlush() {
  if (isFlushPending) return;
  // 更改开关状态
  isFlushPending = true;
  // 执行更新
  nextTick(flushJobs);
}

function flushJobs() {
  // 利用微任务的特性
  Promise.resolve().then(() => {
    // 更改开关状态
    isFlushPending = false;
    // 每次取出一个 job
    // 执行更新的 runner
    let job;
    while ((job = queue.shift())) {
      job && job();
    }
  });
}
