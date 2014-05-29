/**
 * Shader author alteredq / http://alteredqualia.com/
 *
 */

pc.extend(pc.posteffect, function () {

    /**
     * @name pc.posteffect.ColorCorrection
     * @class Allows tuning of the colors of the input render target.
     * @constructor Creates new instance of the post effect.
     * @extends pc.posteffect.PostEffect
     * @param {pc.gfx.Device} graphicsDevice The graphics device of the application
     * @property {Array} powerRgb The r,g,b components of the input render target will be raised to the power contained in the respective values of powerRgb
     * @property {Array} mulRgb The r,g,b components of the input render target will be multiplied by the value contained in the respective values of mulRgb
     */
    function ColorCorrection(graphicsDevice) {
        this.shader = new pc.gfx.Shader(graphicsDevice, {
            attributes: {
                aPosition: pc.gfx.SEMANTIC_POSITION
            },
            vshader: [
                "attribute vec2 aPosition;",
                "",
                "varying vec2 vUv0;",
                "",
                "void main(void)",
                "{",
                "    gl_Position = vec4(aPosition, 0.0, 1.0);",
                "    vUv0 = (aPosition.xy + 1.0) * 0.5;",
                "}"
            ].join("\n"),
            fshader: [
                "precision " + graphicsDevice.precision + " float;",
                "uniform sampler2D uColorBuffer;",
                "uniform vec3 uPowRGB;",
                "uniform vec3 uMulRGB;",

                "varying vec2 vUv0;",

                "void main() {",

                    "gl_FragColor = texture2D( uColorBuffer, vUv0 );",
                    "gl_FragColor.rgb = uMulRGB * pow( gl_FragColor.rgb, uPowRGB );",

                "}"
            ].join("\n")
        });

        // Uniforms
        this.powerRgb = [1,1,1];
        this.mulRgb = [1,1,1];
    }

    ColorCorrection = pc.inherits(ColorCorrection, pc.posteffect.PostEffect);

    ColorCorrection.prototype = pc.extend(ColorCorrection.prototype, {
        render: function (inputTarget, outputTarget, rect) {
            var device = this.device;
            var scope = device.scope;

            scope.resolve("uPowRGB").setValue(this.powerRgb);
            scope.resolve("uMulRGB").setValue(this.mulRgb);
            scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer);
            pc.posteffect.drawFullscreenQuad(device, outputTarget, this.vertexBuffer, this.shader, rect);
        }
    });

    return {
        ColorCorrection: ColorCorrection
    };
}());