# stopwatch-app

Реализовать секундомер, который подсчитывает время в формате «HH: MM: SS» Секундомер должен иметь
следующие кнопки:

- «Start / Stop» - запуск / остановка отсчета времени, останавливает и обнуляет значение таймера.
- «Wait» - работает на двойной клик (время между нажатиями не более 300 мс!) таймер должен
  прекратить отсчет времени; если после него нажать старт, то возобновляется отсчет.
- «Reset» - сброс секундомера на 0. Обнуляет секундомер и снова начинает отсчет. Требования:

* используйте Observables в коде
* RxJS подход
* функциональный подход

### Dev

Запустить режим разработки

```shell
npm start
```

Во вкладке браузера перейти по адресу [http://localhost:3000](http://localhost:3000)

### Building

Для того чтобы создать оптимизированные файлы для хостинга

```shell
npm run build
```

### Deploying/Publishing

```shell
npm run deploy
```
