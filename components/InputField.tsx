import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import { icons } from "../constants";
import { useState } from "react";
import { InputFieldProps } from "@/types/type";

const InputField = ({
  title,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          <Text
            className={`text-lg color-graysecondary font-plusjakartasans_600semibold mb-3 ${labelStyle}`}
          >
            {title}
          </Text>
          <View
            className={`flex flex-row justify-start items-center relative rounded-xl border border-primary active:border-primary focus:border-primary  ${containerStyle}`}
          >
            {icon && (
              <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle}`} />
            )}
            <TextInput
              className={`rounded-xl p-4 font-plusjakartasans_600semibold text-[15px] flex-1 ${inputStyle} text-left`}
              secureTextEntry={title === "Password" && !showPassword}
              {...props}
            />
            {title === "Password" && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={!showPassword ? icons.eye : icons.eyeHide}
                  className="w-8 h-8 mr-3 "
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
