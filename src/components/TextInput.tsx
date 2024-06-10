import {memo, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import type {PropsWithChildren, ReactElement} from 'react';
import type {TextInputProps as RNTextInputProps} from 'react-native';

import {Status} from '../enums';

/* ============================================================================
= Config ======================================================================
============================================================================ */

const StatusColor = Object.freeze({
  [Status.SUCCESS]: 'blue',
  [Status.FAIL]: 'red',
  [Status.UNKNOWN]: '#171738',
});

/* ============================================================================
= Helper Methods ==============================================================
============================================================================ */

/* ============================================================================
= Helper Components ===========================================================
============================================================================ */

type TextInputProps = Omit<
  RNTextInputProps,
  | 'allowFontScaling'
  | 'autoCorrect'
  | 'autoFocus'
  | 'blurOnSubmit'
  | 'caretHidden'
  | 'clearTextOnFocus'
  | 'contextMenuHidden'
  | 'editable'
  | 'multiline'
  | 'onChangeText'
  | 'isReadOnly' // duplicate of isDisabled (editable per RN's component)
  | 'secureTextEntry'
  | 'selectTextOnFocus'
  | 'showSoftInputOnFocus'
> & {
  label?: string;
  isFontScalingEnabled?: boolean;
  isAutoCorrecting?: boolean;
  isAutoCompleting?: boolean;
  isAutoFocused?: boolean;
  isBlurredOnSubmit?: boolean;
  isCaretHidden?: boolean;
  isContextMenuHidden?: boolean;
  isDisabled?: boolean;
  isMultiline?: boolean;
  isSecureTextEntry?: boolean;
  isTextClearedOnFocus?: boolean;
  isTextSelectedOnFocus?: boolean;
  onChangeText(val: string): void;
  onRightIconPress?(): void;
  placeholder: string;
  status?: Status;
  statusMessage?: string;
  value: string;
  iconColor?: string;
};

type InputSubcontentProps = Pick<
  TextInputProps,
  'maxLength' | 'statusMessage' | 'status' | 'value'
>;

function InputSubcontent({
  maxLength,
  value,
  status,
  statusMessage,
}: InputSubcontentProps): ReactElement | null {
  if (statusMessage) {
    const color = status ? StatusColor[status] : 'black';
    return <Text style={[styles.subtext, {color}]}>{statusMessage}</Text>;
  }

  if (value.length && maxLength) {
    const currLength = value.length.toString();
    const maximumLength = maxLength.toString();
    const lengthText = `${currLength} / ${maximumLength}`;

    return <Text style={styles.subtext}>{lengthText}</Text>;
  }

  return null;
}

/* ============================================================================
= Component ===================================================================
============================================================================ */

function TextInputComponent({
  autoCapitalize = 'sentences',
  label,
  isFontScalingEnabled = false,
  isAutoCorrecting = false,
  isAutoFocused = false,
  isBlurredOnSubmit = true,
  isCaretHidden = false,
  isContextMenuHidden = false,
  isDisabled = false,
  isMultiline = false,
  isSecureTextEntry = false,
  isTextClearedOnFocus = false,
  isTextSelectedOnFocus = false,
  maxLength,
  onChangeText,
  onRightIconPress,
  placeholder,
  returnKeyType = 'default',
  status,
  statusMessage,
  value,
  iconColor,
  ...props
}: TextInputProps): PropsWithChildren<ReactElement> {
  const inputRef = useRef<RNTextInput>(null);

  const [isFocused, setIsFocused] = useState(false);

  function handleFocus() {}

  function handleBlur() {
    if (inputRef.current) {
      if (Platform.OS === 'android') {
        Keyboard.dismiss();
      }
      inputRef.current.blur();
      setIsFocused(false);
    }
  }

  useEffect(() => {
    if (!isFocused && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isFocused]);

  let textAlignVertical;

  if (isMultiline) {
    textAlignVertical = 'top';
  }

  return (
    <Pressable style={styles.container} onPress={handleFocus}>
      <>
        {!!label && <Text style={{...styles.label}}>{label}</Text>}

        <View style={[styles.input, {borderColor: StatusColor[status]}]}>
          <RNTextInput
            {...props}
            {...{returnKeyType, value}}
            autoCapitalize={autoCapitalize}
            allowFontScaling={isFontScalingEnabled}
            autoCorrect={isAutoCorrecting}
            autoFocus={isAutoFocused}
            blurOnSubmit={isBlurredOnSubmit}
            caretHidden={isCaretHidden}
            clearTextOnFocus={isTextClearedOnFocus}
            contextMenuHidden={isContextMenuHidden}
            editable={!isDisabled}
            multiline={isMultiline}
            onBlur={handleBlur}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            placeholder={placeholder}
            placeholderTextColor="#7180b9"
            ref={inputRef}
            secureTextEntry={isSecureTextEntry}
            selectTextOnFocus={isTextSelectedOnFocus}
            showSoftInputOnFocus
            style={[styles.rnInput, isMultiline && styles.rnInputMultiline]}
            returnKeyType={returnKeyType}
            value={value}
          />
        </View>

        <View style={styles.subcontent}>
          <InputSubcontent
            maxLength={maxLength}
            statusMessage={statusMessage}
            value={value}
          />
        </View>
      </>
    </Pressable>
  );
}

/* ============================================================================
= Exports =====================================================================
============================================================================ */

const TextInput = memo(TextInputComponent);

export {TextInput};
export type {TextInputProps};

/* ============================================================================
= Common (Shared) Styles
============================================================================ */

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  input: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#171738',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    padding: 8,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  inputDisabled: {
    borderColor: '#ccc',
  },
  label: {
    color: '#171738',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'NunitoSans-Bold',
  },
  maxLengthContent: {
    alignItems: 'flex-end',
  },
  rnInput: {
    color: '#171e2e',
    fontSize: 16,
    fontFamily: 'NunitoSans-Regular',
    flex: 1,
    padding: 0,
  },
  rnInputDisabled: {
    color: '#ccc',
  },
  rnInputMultiline: {
    minHeight: 100,
  },
  subcontent: {
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 4,
    flexDirection: 'row',
  },
  subtext: {
    fontSize: 12,
  },
});
