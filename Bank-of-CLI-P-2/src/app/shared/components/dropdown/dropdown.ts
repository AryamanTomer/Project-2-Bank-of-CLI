import { Component, computed, input, model } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
})
export class Dropdown {
  class = input('');
  classes = computed(() =>
    twMerge(
      'block py-3 rounded-xl w-fit cursor-pointer px-3 border-x-8 border-purple-200 bg-purple-200',
      this.class(),
    ),
  );
  options = input<string[]>([]);
  placeHolder = input('Select');
  value = model('');
}
