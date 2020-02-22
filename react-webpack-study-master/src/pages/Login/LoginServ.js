// import request from 'utils/request';
import config from 'config/Config';
import { has, get } from 'lodash';

// 查询图形验证码
export function queryValidateImg(params) {
  // return request({
  //   url: '',
  //   method: 'GET',
  //   data: params,
  //   app: 'ide-op-mgmt-application'
  // })

  return new Promise((resolve, reject) => {
    resolve({"data":{"image":"/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a\nHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy\nMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAeAFoDASIA\nAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA\nAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3\nODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm\np6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA\nAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx\nBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK\nU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3\nuLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1uDwv\n4fkjMmis2nhT8p0i6aGJZP7xiQ+U7dPvq2QACCBis3wtqeseIfDlprmi6x9qsrjeyw61ZIs7FXZC\nnmQMqIpK8Hy3IyT83CjUn1/wneSBxqGn31yBhFtGFxcevyLHl+OT8o45PGM1yHw48VXGo+AtMvtS\n1DWptQk80yummTTxuRK4X5liII2hQQrDoehyar951VydTs/7W8QW3/H54Z8/d93+y7+Obb67/OEO\nO2Nu7vnHGeW8a+JvCV1/wj39sS6ra+TrdtPb77VrT94u7Dv56rmFc/OVyVyvTIz0H9u+IF+aHw1d\n3sTco+YbXjsdrylufRgpHcZ4HIfE/V72X/hEFbQb61dfElpLG1y0RjdhuwuYnkYE5/ungHGcYp27\nr8QTPUoJ4bq3juLeVJoJUDxyRsGV1IyCCOCCO9SVwX9krqF3LLa+H9At7+QmSeWw1ma0uWyfm8xo\noFkIJOSGPXGRkCtDTtA8XafcMx8Yw3dvs2R21zpe5YxkYw4lEjEAYy7sTkk5PNHKu/8AXyuNO+x1\ntFfOHjTVdV8UfERvDvibSPEF7o9hG7R22jWTQySMGK/aRGxfehOUB3YwcjBJU+l6TPp9no1jZXl9\n4vsbCG3jQWt5YmFYIgo2eZcQRDYAu0k+aMYIfGGFChfqFzvL++t9M065v7yTy7W1ieaZ9pO1FBLH\nA5OAD0osL631PTra/s5PMtbqJJoX2kbkYAqcHkZBHWuF8SWOgaj8O/El9pOr3V9HDp1yN8Otzzxh\nxETtYeaVPUZB7Hkc1xfhrTPFureCNMv9L8F+FPKhsUjT+3Fee7vSiYEisQAqMAAisQAAMHZtpWjc\nZ7ZfalY6XAs+oXttaQs2wSXEqxqWwTjJI5wD+VZ//CYeGP8AoY9I/wDA6P8A+KrN8CT6Dq+jR6zp\neg2mk3hL213bpAiTW8qth4n2gEcgHBAJG0kDOK6yj3QCvP8A4Jf8kh0L/t4/9KJK6jxJp2s6np0c\nOh69/Yt0sodrj7GlzuTBBTa5wMkg59vepPDmgWPhbw/Z6LpqyC0tUKp5jbmYklmYn1LEnjA54AHF\nSBqV534w+3eKPFmh6DY6NqUY0jWLbU7jUbiHZaPFGpYqkmcs+XC7QOoOcAE16JRQBFPbQXUYS4gj\nmQHIWRAwB9ear/2ZHH/x7XFzbHphJNygegV8qB9AMduKu0UrITSZ5r5d5D8fsRypcOPC+R5w2Fl+\n1dCVGAc85C9OMd6737bcx8T6dNx954XV0A9RyGP0259M0z+xNO/4SH+3/s//ABM/sn2Lz97f6nfv\n27c7fvc5xn3rQosFvM4T4hW/hvUfCGu3l7ZWD6lFpdwLeS8tlWdcRuV2bwG+8TjHfOOa4Dw34/0T\nQ/BOmxanrnibw9exWSMth5IuBdqFwssLTxOAjgABQyoCCAAPmPvDokkbI6hkYEMrDIIPY1U/smyX\niKN4F/u28rxKT64QgZ96fNJC1OB+Hum+MdJ8P3GoT6fpzXet302p3FlcyyWrWjyH7uQsu4FQp2kK\nU5B3Hp1v/CQan/0J+t/9/rL/AOSK0fs19H/qtR356/aYVbH02bP1z+FHm6p/z52f/gU3/wAbo50t\n0JyS3P/Z","uniqueId":"cube-f4d1d4c7-1316-4327-b1c6-6b1f4bba3f90"},"resultCode":"0","resultMsg":"success"})
  })
}

// 登录请求
export function reqLogin(params) {
  // isLogin为false则免登陆
  if(has(config, 'isLogin') && 'false' === '' + get(config, 'isLogin', null)){
    let loginRes = {"data":{"auth":"eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJjYTgwY2MyYi0wN2M1LTQxYjUtYTc1NS0zMGUwYzA3YjM1NDQiLCJzdWIiOiJrZXkmX18mbnVza2luJl9fJjYmX18mY2hlbmRhaGFpJl9fJjAmX18mbnVza2luJl9fJnBjJl9fJjAmX18mMSJ9.YVyo_J91EPrAhdBNXaLBehOeA4caJMcU21-F4GuVycZRvcSsXBtWyH5XI7mJEe1ATmTUhSguETu-q6ZgxeNivA", "code": "0"},"resultCode":0,"resultMsg":"success"}
    return Promise.resolve(loginRes)
  }

  // return request({
  //   url: '',
  //   method: 'post',
  //   data: params,
  //   app: 'ide-op-mgmt-application',
  //   headers: {
  //     'Content-type': 'application/json',
  //     'Application-Key': 'cube'
  //   }
  // })
}