import axios from 'axios';
import { Question } from '../types/assessment';

const API_URL = 'https://api.openai.com/v1/chat/completions';

// Keep the OCR specification separate as it's constant
const OCR_SPECIFICATION = {
  "comments": {
    "syntax": "// comment text",
    "description": "Two forward slashes denote comments"
  },
  "variables": {
    "assignment": "variable = value",
    "constants": "const name = value",
    "global": "global variable = value"
  },
  "dataCasting": {
    "toString": "str(value)",
    "toInteger": "Int(value)",
    "toFloat": "float(value)",
    "toReal": "real(value)",
    "toBoolean": "bool(value)"
  },
  "operators": {
    "comparison": {
      "equalTo": "==",
      "notEqual": "!=",
      "lessThan": "<",
      "greaterThan": ">",
      "lessOrEqual": "<=",
      "greaterOrEqual": ">="
    },
    "arithmetic": {
      "addition": "+",
      "subtraction": "-",
      "multiplication": "*",
      "division": "/",
      "exponentiation": "^",
      "modulus": "MOD",
      "quotient": "DIV"
    },
    "logical": {
      "and": "AND",
      "or": "OR",
      "not": "NOT"
    }
  },
  "inputOutput": {
    "input": "variable = input(\"prompt\")",
    "output": "print(\"message\")"
  },
  "controlStructures": {
    "ifThenElse": {
      "syntax": [
        "if condition then",
        "  statements",
        "elseif condition then",
        "  statements",
        "else",
        "  statements",
        "endif"
      ]
    },
    "switch": {
      "syntax": [
        "switch variable:",
        "  case value1:",
        "    statements",
        "  case value2:",
        "    statements",
        "  default:",
        "    statements",
        "endswitch"
      ]
    }
  },
  "loops": {
    "for": {
      "syntax": [
        "for variable = start_value to end_value",
        "  statements",
        "next variable"
      ]
    },
    "while": {
      "syntax": [
        "while condition",
        "  statements",
        "endwhile"
      ]
    },
    "doWhile": {
      "syntax": [
        "do",
        "  statements",
        "while condition"
      ]
    }
  },
  "stringOperations": {
    "length": "string.length",
    "substring": "string.substring(start, length)",
    "leftSubstring": "string.left(n)",
    "rightSubstring": "string.right(n)",
    "toUppercase": "string.upper",
    "toLowercase": "string.lower"
  },
  "ascii": {
    "toAscii": "ASC(character)",
    "fromAscii": "CHR(code)"
  },
  "arrays": {
    "oneDimensional": "array name[size]",
    "withInitialValues": "array name = [value1, value2, ...]",
    "multiDimensional": "array name[rows, columns]",
    "assignment": "arrayName[index] = value",
    "length": "len(arrayName)"
  },
  "randomNumbers": {
    "integer": "random(min, max)",
    "real": "random(minReal, maxReal)"
  },
  "fileHandling": {
    "open": "fileVar = open(\"filename\")",
    "close": "fileVar.close()",
    "readLine": "fileVar.readLine()",
    "writeLine": "fileVar.writeLine(\"text\")",
    "endOfFile": "fileVar.endOfFile()",
    "createNew": "newFile(\"filename\")"
  },
  "subprograms": {
    "procedure": {
      "syntax": [
        "procedure name(parameters)",
        "  statements",
        "endprocedure"
      ]
    },
    "function": {
      "syntax": [
        "function name(parameters)",
        "  statements",
        "  return value",
        "endfunction"
      ]
    }
  }
};

export class OpenAIService {
  private headers: { [key: string]: string };

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
    };
  }

  async evaluateCode(questionData: Question, code: string) {
    try {
      const messages = [
        {
          role: 'system',
          content: `${questionData.systemPrompt}

OCR Exam Reference Language Specification:
${JSON.stringify(OCR_SPECIFICATION, null, 2)}`
        },
        {
          role: 'user',
          content: `${questionData.prompt}

<student_response>
${code}
</student_response>`
        }
      ];

      console.log('Sending prompt to OpenAI:', JSON.stringify(messages, null, 2));

      const response = await axios.post(API_URL, {
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 4000,
        temperature: 0.1
      }, { headers: this.headers });

      console.log('OpenAI Response:', response.data);
      console.log('Response Content:', response.data.choices[0]?.message?.content);
      console.log('Parsed Content:', JSON.parse(response.data.choices[0]?.message?.content));

      return response.data.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to evaluate code');
    }
  }
}

export const openAIService = new OpenAIService();