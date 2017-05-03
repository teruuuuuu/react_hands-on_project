import * as types from '../define/action/sample-action-define'

export function change_text(text) {
  return { type: types.CHANGE_TEXT, text: text }
}
