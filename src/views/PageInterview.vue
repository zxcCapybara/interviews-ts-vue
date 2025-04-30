<script setup lang="ts"></script>

<template>
  <main class="shadow-md p-5 w-2/3 my-10 mx-auto">
    <h1 class="mb-5">Собеседование в компанию</h1>

    <label for="company1">Компания</label>
    <input id="company1" type="text" class="inputInterview mb-5" />

    <label for="link1">Описание вакансии (ссылка)</label>
    <input id="link1" type="text" class="inputInterview mb-5" />

    <label for="contact1">Контакт (имя)</label>
    <input id="contact1" type="text" class="inputInterview mb-5" />

    <label for="tg1">Telegram username HR</label>
    <input id="tg1" type="text" class="inputInterview mb-5" />

    <label for="whatsapp1">WhatsApp HR</label>
    <input id="whatsapp1" type="text" class="inputInterview mb-5" />

    <label for="phone1">Телефон HR</label>
    <input id="phone1" type="text" class="inputInterview mb-5" />

    <div class="flex gap-5">
      <div class="w-full">
        <label for="zp">Зарплатная вилка от</label>
        <app-input id="zp" inputId="integeronly" fluid class="inputInterview" />
      </div>
      <div class="w-full">
        <label for="zp2">Зарплатная вилка до</label>
        <app-input id="z2" inputId="integeronly" fluid class="inputInterview" />
      </div>
    </div>

    <button class="bg-blue-500 hover:bg-blue-600 btn mb-5">
      <span class="pi pi-plus"></span>
      <p>Добавить этап</p>
    </button>

    <div class="border-1 border-gray-100 p-5 rounded-xl">
      <label for="name1">Название этапа</label>
      <input type="text" class="inputInterview mb-5" />

      <label for="calendar">Дата прохождение этапа</label>
      <input type="date" id="calendar" dateFormat="dd.mm.yy" class="inputInterview mb-5" />

      <label for="com1">Комментарий</label>
      <textarea name="com" id="com1" class="inputInterview h-[7rem]"></textarea>

      <button class="bg-red-600 btn hover:bg-red-700">Удалить этап</button>
    </div>

    <div class="mt-6">
      <div class="flex gap-6">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            id="radio1"
            type="radio"
            name="status"
            value="rejected"
            class="checked:border-red-600 checked:bg-red-600 radio"
          />
          <span class="text-gray-600 group-hover:text-red-600 transition-colors">Отказ</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            id="radio2"
            type="radio"
            name="status"
            value="offered"
            class="checked:border-green-600 checked:bg-green-600 radio"
          />
          <span class="text-gray-600 group-hover:text-green-600 transition-colors">Оффер</span>
        </label>
      </div>
    </div>

    <button class="bg-[#e40f79] hover:bg-[#c31c6f] btn">
      <span class="pi pi-save"></span>
      <p>Сохранить</p>
    </button>
  </main>
</template>
